/**
 * Grok Client Implementation (DISABLED)
 *
 * This file is commented out - MarketMind now uses ClaudeClient only.
 * To re-enable Grok, uncomment this file and update llm/index.ts exports.
 */

/*
import { logger } from "../utils/logger";
import {
  LLMClient,
  LLMError,
  LLMErrorType,
  LLMRequest,
  LLMResponse,
} from "./LLMClient";

const XAI_API_URL = "https://api.x.ai/v1/chat/completions";
const DEFAULT_MODEL = "grok-4-1-fast-reasoning";
const DEFAULT_MAX_TOKENS = 4096;
const DEFAULT_TEMPERATURE = 0.7;

interface XAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface XAIErrorResponse {
  error?: {
    message: string;
    type: string;
    code?: string;
  };
}

export class GrokClient implements LLMClient {
  readonly provider = "xai";
  private readonly apiKey: string | undefined;
  private readonly model: string;

  constructor(model?: string) {
    this.model = model ?? process.env["GROK_MODEL"] ?? DEFAULT_MODEL;
    this.apiKey = process.env["XAI_API_KEY"];

    if (this.apiKey) {
      logger.debug("Grok client initialized", { model: this.model });
    } else {
      logger.warn("XAI_API_KEY not set - Grok client not initialized");
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey !== "your-real-grok-api-key-here";
  }

  async complete(request: LLMRequest): Promise<LLMResponse> {
    if (!this.apiKey) {
      throw new LLMError(
        "Grok client not configured. Set XAI_API_KEY environment variable.",
        LLMErrorType.AUTHENTICATION,
      );
    }

    const { messages, maxTokens, temperature } = request;

    const apiMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const requestBody = {
      model: this.model,
      messages: apiMessages,
      max_tokens: maxTokens ?? DEFAULT_MAX_TOKENS,
      temperature: temperature ?? DEFAULT_TEMPERATURE,
    };

    try {
      logger.debug("Sending request to Grok", {
        model: this.model,
        messageCount: apiMessages.length,
      });

      const response = await fetch(XAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => ({}))) as XAIErrorResponse;
        throw await this.handleErrorResponse(response.status, errorData);
      }

      const data = (await response.json()) as XAIResponse;

      const choice = data.choices[0];
      if (!choice) {
        throw new LLMError(
          "No response content from Grok API",
          LLMErrorType.INVALID_REQUEST,
        );
      }

      const content = choice.message.content;

      logger.debug("Received response from Grok", {
        model: data.model,
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
        finishReason: choice.finish_reason,
      });

      return {
        content,
        usage: {
          inputTokens: data.usage.prompt_tokens,
          outputTokens: data.usage.completion_tokens,
        },
        model: data.model,
        finishReason: choice.finish_reason,
      };
    } catch (error) {
      if (error instanceof LLMError) {
        throw error;
      }
      throw this.mapError(error);
    }
  }

  private async handleErrorResponse(
    status: number,
    errorData: XAIErrorResponse,
  ): Promise<LLMError> {
    const errorMessage = errorData.error?.message ?? "Unknown error";

    if (status === 401) {
      return new LLMError("Invalid xAI API key", LLMErrorType.AUTHENTICATION);
    }
    if (status === 429) {
      return new LLMError("xAI rate limit exceeded", LLMErrorType.RATE_LIMIT);
    }
    if (status >= 400 && status < 500) {
      return new LLMError(
        `Invalid request: ${errorMessage}`,
        LLMErrorType.INVALID_REQUEST,
      );
    }
    if (status >= 500) {
      return new LLMError("xAI server error", LLMErrorType.SERVER_ERROR);
    }

    return new LLMError(
      `xAI API error (${status}): ${errorMessage}`,
      LLMErrorType.UNKNOWN,
    );
  }

  private mapError(error: unknown): LLMError {
    if (error instanceof Error) {
      if (
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("ECONNREFUSED")
      ) {
        return new LLMError(
          "Network error connecting to xAI",
          LLMErrorType.NETWORK,
          error,
        );
      }
    }

    return new LLMError(
      `Unknown error: ${error instanceof Error ? error.message : String(error)}`,
      LLMErrorType.UNKNOWN,
      error,
    );
  }
}
*/

// Placeholder export to prevent import errors if this file is accidentally imported
export {};
