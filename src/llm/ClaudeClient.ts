import {
  LLMClient,
  LLMRequest,
  LLMResponse,
  LLMError,
  LLMErrorType
} from './LLMClient';
import { logger } from '../utils/logger';

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const DEFAULT_MAX_TOKENS = 4096;
const DEFAULT_TEMPERATURE = 0.3;

interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string | null;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface AnthropicErrorResponse {
  type: string;
  error: {
    type: string;
    message: string;
  };
}

export class ClaudeClient implements LLMClient {
  readonly provider = 'anthropic';
  private readonly apiKey: string | undefined;
  private readonly model: string;

  constructor(model?: string) {
    this.model = model ?? process.env['CLAUDE_MODEL'] ?? DEFAULT_MODEL;
    this.apiKey = process.env['ANTHROPIC_API_KEY'];
    
    if (this.apiKey) {
      logger.debug('Claude client initialized', { model: this.model });
    } else {
      logger.warn('ANTHROPIC_API_KEY not set - Claude client not initialized');
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey !== 'your_anthropic_api_key_here' && this.apiKey !== 'your-anthropic-api-key-here';
  }

  async complete(request: LLMRequest): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new LLMError(
        'Claude client not configured. Set ANTHROPIC_API_KEY environment variable.',
        LLMErrorType.AUTHENTICATION
      );
    }

    const { messages, maxTokens, temperature } = request;

    // Extract system message if present
    const systemMessage = messages.find((m) => m.role === 'system');
    const conversationMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

    // Build request body matching Anthropic API structure
    const requestBody: Record<string, unknown> = {
      model: this.model,
      max_tokens: maxTokens ?? DEFAULT_MAX_TOKENS,
      messages: conversationMessages
    };

    // Add system prompt if present
    if (systemMessage?.content) {
      requestBody.system = systemMessage.content;
    }

    // Add temperature if specified
    if (temperature !== undefined) {
      requestBody.temperature = temperature;
    } else {
      requestBody.temperature = DEFAULT_TEMPERATURE;
    }

    try {
      logger.debug('Sending request to Claude', {
        model: this.model,
        messageCount: conversationMessages.length,
        hasSystemPrompt: !!systemMessage,
        maxTokens: requestBody.max_tokens
      });

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': API_VERSION,
          'content-type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as AnthropicErrorResponse;
        logger.error('Claude API error response', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw this.handleErrorResponse(response.status, errorData);
      }

      const data = await response.json() as AnthropicResponse;

      // Extract text content from response
      const content = data.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('');

      logger.debug('Received response from Claude', {
        model: data.model,
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens,
        stopReason: data.stop_reason,
        contentLength: content.length
      });

      return {
        content,
        usage: {
          inputTokens: data.usage.input_tokens,
          outputTokens: data.usage.output_tokens
        },
        model: data.model,
        finishReason: data.stop_reason ?? undefined
      };
    } catch (error) {
      if (error instanceof LLMError) {
        throw error;
      }
      
      logger.error('Claude API request failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      throw this.mapError(error);
    }
  }

  private handleErrorResponse(status: number, errorData: AnthropicErrorResponse): LLMError {
    const errorMessage = errorData.error?.message ?? 'Unknown error';
    const errorType = errorData.error?.type ?? 'unknown';

    if (status === 401) {
      return new LLMError(
        `Invalid API key: ${errorMessage}`,
        LLMErrorType.AUTHENTICATION
      );
    }
    if (status === 429) {
      return new LLMError(
        `Rate limit exceeded: ${errorMessage}`,
        LLMErrorType.RATE_LIMIT
      );
    }
    if (status >= 400 && status < 500) {
      return new LLMError(
        `Invalid request (${errorType}): ${errorMessage}`,
        LLMErrorType.INVALID_REQUEST
      );
    }
    if (status >= 500) {
      return new LLMError(
        `Anthropic server error: ${errorMessage}`,
        LLMErrorType.SERVER_ERROR
      );
    }

    return new LLMError(
      `API error (${status}): ${errorMessage}`,
      LLMErrorType.UNKNOWN
    );
  }

  private mapError(error: unknown): LLMError {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('network') || message.includes('fetch') || message.includes('ECONNREFUSED') || message.includes('enotfound')) {
        return new LLMError(
          'Network error connecting to Anthropic',
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
