export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface LLMResponse {
  content: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  model: string;
  finishReason?: string;
}

export enum LLMErrorType {
  AUTHENTICATION = 'authentication',
  RATE_LIMIT = 'rate_limit',
  INVALID_REQUEST = 'invalid_request',
  SERVER_ERROR = 'server_error',
  NETWORK = 'network',
  UNKNOWN = 'unknown'
}

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

export interface LLMClient {
  readonly provider: string;
  complete(request: LLMRequest): Promise<LLMResponse>;
  isConfigured(): boolean;
}
