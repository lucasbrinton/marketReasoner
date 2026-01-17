/**
 * LLM Client Interface
 * 
 * Abstract interface for LLM providers. All AI interactions must go through
 * implementations of this interface. Designed for swappable providers.
 */

/**
 * Message structure for LLM conversations
 */
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Request configuration for LLM calls
 */
export interface LLMRequest {
  messages: LLMMessage[];
  maxTokens?: number;
  temperature?: number;
}

/**
 * Response structure from LLM calls
 */
export interface LLMResponse {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  model: string;
  finishReason?: string;
}

/**
 * Error types for LLM operations
 */
export enum LLMErrorType {
  AUTHENTICATION = 'authentication',
  RATE_LIMIT = 'rate_limit',
  INVALID_REQUEST = 'invalid_request',
  SERVER_ERROR = 'server_error',
  NETWORK = 'network',
  UNKNOWN = 'unknown'
}

/**
 * Structured error for LLM operations
 */
export class LLMError extends Error {
  public readonly type: LLMErrorType;
  public readonly errorCause?: unknown;

  constructor(
    message: string,
    type: LLMErrorType,
    errorCause?: unknown
  ) {
    super(message);
    this.name = 'LLMError';
    this.type = type;
    this.errorCause = errorCause;
  }
}

/**
 * Abstract LLM Client Interface
 * 
 * All LLM providers must implement this interface. This ensures
 * consistent behavior and allows for easy provider swapping.
 */
export interface LLMClient {
  /**
   * Provider identifier
   */
  readonly provider: string;

  /**
   * Complete a prompt and return the response
   */
  complete(request: LLMRequest): Promise<LLMResponse>;

  /**
   * Check if the client is properly configured
   */
  isConfigured(): boolean;
}
