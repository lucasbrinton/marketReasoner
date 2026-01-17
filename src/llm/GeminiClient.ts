/**
 * Gemini Client Implementation
 * 
 * Implements LLMClient interface for Google's Gemini API.
 * Uses the free-tier gemini-2.0-flash model for cost-effective reasoning.
 */

import { GoogleGenerativeAI, GenerativeModel, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import {
  LLMClient,
  LLMRequest,
  LLMResponse,
  LLMError,
  LLMErrorType
} from './LLMClient';
import { logger } from '../utils/logger';

const DEFAULT_MODEL = 'gemini-2.0-flash';
const DEFAULT_MAX_TOKENS = 4096;
const DEFAULT_TEMPERATURE = 0.7;

export class GeminiClient implements LLMClient {
  readonly provider = 'google';
  private readonly apiKey: string | undefined;
  private readonly model: string;
  private genAI: GoogleGenerativeAI | null = null;
  private generativeModel: GenerativeModel | null = null;

  constructor(model?: string) {
    this.model = model ?? process.env['GEMINI_MODEL'] ?? DEFAULT_MODEL;
    this.apiKey = process.env['GOOGLE_API_KEY'];

    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.generativeModel = this.genAI.getGenerativeModel({
        model: this.model,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });
      logger.debug('Gemini client initialized', { model: this.model });
    } else {
      logger.warn('GOOGLE_API_KEY not set - Gemini client not initialized');
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey !== 'your-google-gemini-api-key-here';
  }

  async complete(request: LLMRequest): Promise<LLMResponse> {
    if (!this.generativeModel || !this.apiKey) {
      throw new LLMError(
        'Gemini client not configured. Set GOOGLE_API_KEY environment variable.',
        LLMErrorType.AUTHENTICATION
      );
    }

    const { messages, maxTokens, temperature } = request;

    // Build the prompt from messages
    // Gemini uses a different format - combine system + user messages
    let systemPrompt = '';
    let userPrompt = '';

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemPrompt += msg.content + '\n\n';
      } else if (msg.role === 'user') {
        userPrompt += msg.content + '\n\n';
      } else if (msg.role === 'assistant') {
        // For context in retries
        userPrompt += `Previous response: ${msg.content}\n\n`;
      }
    }

    // Combine prompts (JSON enforcement via responseMimeType)
    const fullPrompt = `${systemPrompt}${userPrompt}`.trim();

    let result;
    try {
      logger.debug('Sending request to Gemini', {
        model: this.model,
        promptLength: fullPrompt.length
      });

      result = await this.generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens ?? DEFAULT_MAX_TOKENS,
          temperature: temperature ?? DEFAULT_TEMPERATURE,
          responseMimeType: 'application/json',
        },
      });

      const response = result.response;
      
      // Extract text from response - try multiple approaches
      let text: string = '';
      
      // Method 1: Direct text() method
      try {
        text = response.text();
      } catch {
        // Method 2: Extract from candidates structure
        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts?.[0]) {
          const part = candidate.content.parts[0];
          text = (part as { text?: string })?.text ?? '';
        }
      }

      if (!text) {
        logger.error('Empty response from Gemini', {
          candidates: JSON.stringify(response.candidates),
          promptFeedback: JSON.stringify(response.promptFeedback)
        });
        throw new LLMError(
          'No response content from Gemini API',
          LLMErrorType.INVALID_REQUEST
        );
      }

      // Get usage metadata if available
      const usageMetadata = response.usageMetadata;

      logger.debug('Received response from Gemini', {
        model: this.model,
        inputTokens: usageMetadata?.promptTokenCount,
        outputTokens: usageMetadata?.candidatesTokenCount,
        responseLength: text.length
      });

      return {
        content: text,
        usage: usageMetadata ? {
          inputTokens: usageMetadata.promptTokenCount ?? 0,
          outputTokens: usageMetadata.candidatesTokenCount ?? 0,
        } : undefined,
        model: this.model,
        finishReason: response.candidates?.[0]?.finishReason ?? 'unknown',
      };
    } catch (error) {
      if (error instanceof LLMError) {
        throw error;
      }
      
      // Full response logging for debugging
      logger.error('Gemini API error details', {
        error: error instanceof Error ? { message: error.message, name: error.name, stack: error.stack } : error,
        model: this.model,
        result: result ? JSON.stringify(result, null, 2) : 'no result'
      });
      
      throw this.mapError(error);
    }
  }

  private mapError(error: unknown): LLMError {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('api key') || message.includes('authentication') || message.includes('401')) {
        return new LLMError(
          'Invalid Google API key',
          LLMErrorType.AUTHENTICATION,
          error
        );
      }

      if (message.includes('quota') || message.includes('rate limit') || message.includes('429')) {
        return new LLMError(
          'Gemini rate limit exceeded',
          LLMErrorType.RATE_LIMIT,
          error
        );
      }

      // Specific 404 NOT_FOUND detection for model issues
      if (message.includes('not_found') || message.includes('404') || message.includes('not found')) {
        return new LLMError(
          `Model not found (404): ${error.message}. Try gemini-1.5-flash or gemini-2.0-flash.`,
          LLMErrorType.INVALID_REQUEST,
          error
        );
      }

      if (message.includes('model')) {
        return new LLMError(
          `Model error: ${error.message}`,
          LLMErrorType.INVALID_REQUEST,
          error
        );
      }

      if (message.includes('invalid') || message.includes('400')) {
        return new LLMError(
          `Invalid request: ${error.message}`,
          LLMErrorType.INVALID_REQUEST,
          error
        );
      }

      if (message.includes('500') || message.includes('503') || message.includes('server')) {
        return new LLMError(
          'Gemini server error',
          LLMErrorType.SERVER_ERROR,
          error
        );
      }

      if (message.includes('network') || message.includes('fetch') || message.includes('ECONNREFUSED') || message.includes('enotfound')) {
        return new LLMError(
          'Network error connecting to Gemini',
          LLMErrorType.NETWORK,
          error
        );
      }
    }

    return new LLMError(
      `Unknown error: ${error instanceof Error ? error.message : String(error)}`,
      LLMErrorType.UNKNOWN,
      error
    );
  }
}
