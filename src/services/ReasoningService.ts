/**
 * Reasoning Service
 * 
 * Central service for all AI reasoning operations.
 * ALL AI calls must go through this service - no direct LLM calls allowed elsewhere.
 * 
 * Features:
 * - Schema validation with retry logic
 * - Exponential backoff on failures
 * - Structured error responses
 * - Comprehensive logging
 */

import { z } from 'zod';
import { LLMClient, LLMError, LLMErrorType, LLMMessage } from '../llm/LLMClient';
import { getMasterSystemPrompt } from '../prompts/systemPrompts';
import { logger, logAIInteraction } from '../utils/logger';
import { createInsufficientDataResponse, InsufficientDataResponse } from '../schemas/marketAnalysis';

/**
 * Configuration for reasoning requests
 */
export interface ReasoningConfig {
  maxRetries?: number;
  baseDelayMs?: number;
  maxTokens?: number;
  temperature?: number;
}

const DEFAULT_CONFIG: Required<ReasoningConfig> = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxTokens: 4096,
  temperature: 0.3
};

/**
 * Result of a reasoning operation
 */
export type ReasoningResult<T> =
  | { success: true; data: T; metadata: ReasoningMetadata }
  | { success: false; error: InsufficientDataResponse; metadata: ReasoningMetadata };

/**
 * Metadata about the reasoning operation
 */
export interface ReasoningMetadata {
  attempts: number;
  totalDurationMs: number;
  model: string;
  tokensUsed?: {
    input: number;
    output: number;
  };
}

/**
 * Sleep for a given duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function getBackoffDelay(attempt: number, baseDelayMs: number): number {
  return baseDelayMs * Math.pow(2, attempt);
}

/**
 * Extract JSON from a string that might have extra content
 */
function extractJSON(text: string): string {
  // Try to find JSON object in the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  return text;
}

/**
 * Format Zod errors into readable strings
 */
function formatZodErrors(error: z.ZodError): string[] {
  return error.errors.map((e) => {
    const path = e.path.join('.');
    return path ? `${path}: ${e.message}` : e.message;
  });
}

/**
 * ReasoningService - Central AI reasoning orchestrator
 */
export class ReasoningService {
  private readonly llmClient: LLMClient;
  private readonly config: Required<ReasoningConfig>;

  constructor(llmClient: LLMClient, config?: ReasoningConfig) {
    this.llmClient = llmClient;
    this.config = { ...DEFAULT_CONFIG, ...config };

    if (!this.llmClient.isConfigured()) {
      logger.warn('LLM client is not properly configured');
    }
  }

  /**
   * Execute a reasoning task with schema validation and retry logic
   */
  async reason<T>(
    taskPrompt: string,
    schema: z.ZodSchema<T>,
    context: { module: string; inputData: unknown }
  ): Promise<ReasoningResult<T>> {
    const startTime = Date.now();
    let attempts = 0;
    let lastError: string | undefined;
    let lastRawOutput: string | undefined;
    let tokensUsed: { input: number; output: number } | undefined;
    let model = 'unknown';

    // Check if client is configured
    if (!this.llmClient.isConfigured()) {
      return {
        success: false,
        error: createInsufficientDataResponse(
          'LLM client is not configured. Please set ANTHROPIC_API_KEY.',
          0,
          'Client not configured'
        ),
        metadata: {
          attempts: 0,
          totalDurationMs: Date.now() - startTime,
          model: 'none'
        }
      };
    }

    // Build messages
    const systemPrompt = getMasterSystemPrompt();
    let currentPrompt = taskPrompt;

    while (attempts < this.config.maxRetries) {
      attempts++;

      try {
        // Apply backoff if this is a retry
        if (attempts > 1) {
          const delay = getBackoffDelay(attempts - 1, this.config.baseDelayMs);
          logger.debug(`Retry ${attempts}/${this.config.maxRetries}, waiting ${delay}ms`);
          await sleep(delay);
        }

        // Build messages for this attempt
        const messages: LLMMessage[] = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: currentPrompt }
        ];

        // Call LLM
        const response = await this.llmClient.complete({
          messages,
          maxTokens: this.config.maxTokens,
          temperature: this.config.temperature
        });

        model = response.model;
        lastRawOutput = response.content;

        if (response.usage) {
          tokensUsed = {
            input: (tokensUsed?.input ?? 0) + response.usage.inputTokens,
            output: (tokensUsed?.output ?? 0) + response.usage.outputTokens
          };
        }

        // Try to parse JSON
        const jsonString = extractJSON(response.content);
        let parsed: unknown;

        try {
          parsed = JSON.parse(jsonString);
        } catch (parseError) {
          lastError = `JSON parse error: ${parseError instanceof Error ? parseError.message : String(parseError)}`;
          logger.warn('Failed to parse JSON from LLM response', {
            attempt: attempts,
            error: lastError,
            rawOutput: response.content.substring(0, 200)
          });
          
          // Update prompt for retry with parse error feedback
          currentPrompt = this.buildRetryPrompt(taskPrompt, response.content, [lastError]);
          continue;
        }

        // Validate against schema
        const validationResult = schema.safeParse(parsed);

        if (validationResult.success) {
          // Success!
          const durationMs = Date.now() - startTime;

          logAIInteraction({
            module: context.module,
            request: { prompt: taskPrompt, data: context.inputData },
            response: { raw: response.content, parsed: validationResult.data },
            durationMs,
            success: true,
            retryCount: attempts - 1
          });

          return {
            success: true,
            data: validationResult.data,
            metadata: {
              attempts,
              totalDurationMs: durationMs,
              model,
              tokensUsed
            }
          };
        }

        // Validation failed
        const validationErrors = formatZodErrors(validationResult.error);
        lastError = validationErrors.join('; ');

        logger.warn('Schema validation failed', {
          attempt: attempts,
          errors: validationErrors
        });

        // Update prompt for retry with validation errors
        currentPrompt = this.buildRetryPrompt(taskPrompt, response.content, validationErrors);

      } catch (error) {
        if (error instanceof LLMError) {
          lastError = `LLM Error (${error.type}): ${error.message}`;

          // Don't retry on authentication errors
          if (error.type === LLMErrorType.AUTHENTICATION) {
            logger.error('Authentication error - not retrying', { error: lastError });
            break;
          }

          // Rate limit - use longer backoff
          if (error.type === LLMErrorType.RATE_LIMIT) {
            const delay = getBackoffDelay(attempts, this.config.baseDelayMs * 2);
            logger.warn(`Rate limited, waiting ${delay}ms before retry`);
            await sleep(delay);
          }
        } else {
          lastError = `Unexpected error: ${error instanceof Error ? error.message : String(error)}`;
        }

        logger.error('Error during reasoning', {
          attempt: attempts,
          error: lastError
        });
      }
    }

    // All retries exhausted
    const durationMs = Date.now() - startTime;

    logAIInteraction({
      module: context.module,
      request: { prompt: taskPrompt, data: context.inputData },
      response: lastRawOutput
        ? { raw: lastRawOutput, validationError: lastError }
        : undefined,
      durationMs,
      success: false,
      retryCount: attempts
    });

    return {
      success: false,
      error: createInsufficientDataResponse(
        'Unable to generate valid analysis due to schema mismatch or data issues.',
        attempts,
        lastError
      ),
      metadata: {
        attempts,
        totalDurationMs: durationMs,
        model,
        tokensUsed
      }
    };
  }

  /**
   * Build a retry prompt with error feedback
   */
  private buildRetryPrompt(
    originalPrompt: string,
    previousOutput: string,
    errors: string[]
  ): string {
    return `${originalPrompt}

## PREVIOUS ATTEMPT FAILED

Your previous output had errors:
${errors.map((e) => `- ${e}`).join('\n')}

Previous output (first 500 chars):
${previousOutput.substring(0, 500)}

Please try again. Output ONLY valid JSON matching the exact schema. No markdown code blocks, no explanations, no additional text. Just the raw JSON object.`;
  }
}
