/**
 * ReasoningService Tests
 */

import { z } from 'zod';
import { ReasoningService } from '../services/ReasoningService';
import { LLMClient, LLMRequest, LLMResponse, LLMError, LLMErrorType } from '../llm/LLMClient';

// Mock LLM Client for testing
class MockLLMClient implements LLMClient {
  readonly provider = 'mock';
  private responses: Array<{ content: string; shouldFail?: boolean; error?: LLMError }> = [];
  private configured = true;
  public callCount = 0;

  setConfigured(configured: boolean): void {
    this.configured = configured;
  }

  addResponse(content: string): void {
    this.responses.push({ content });
  }

  addErrorResponse(error: LLMError): void {
    this.responses.push({ content: '', shouldFail: true, error });
  }

  isConfigured(): boolean {
    return this.configured;
  }

  async complete(request: LLMRequest): Promise<LLMResponse> {
    this.callCount++;
    const response = this.responses.shift();

    if (!response) {
      throw new Error('No mock response configured');
    }

    if (response.shouldFail && response.error) {
      throw response.error;
    }

    return {
      content: response.content,
      model: 'mock-model',
      usage: { inputTokens: 100, outputTokens: 50 }
    };
  }

  reset(): void {
    this.responses = [];
    this.callCount = 0;
    this.configured = true;
  }
}

// Simple test schema
const TestSchema = z.object({
  name: z.string().min(1),
  value: z.number().positive()
});

type TestType = z.infer<typeof TestSchema>;

describe('ReasoningService', () => {
  let mockClient: MockLLMClient;
  let service: ReasoningService;

  beforeEach(() => {
    mockClient = new MockLLMClient();
    service = new ReasoningService(mockClient, {
      maxRetries: 3,
      baseDelayMs: 10 // Fast retries for testing
    });
  });

  describe('successful reasoning', () => {
    it('should return parsed data on valid response', async () => {
      mockClient.addResponse('{"name": "test", "value": 42}');

      const result = await service.reason<TestType>(
        'Test prompt',
        TestSchema,
        { module: 'test', inputData: {} }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('test');
        expect(result.data.value).toBe(42);
        expect(result.metadata.attempts).toBe(1);
      }
    });

    it('should extract JSON from wrapped response', async () => {
      mockClient.addResponse('Here is the JSON: {"name": "test", "value": 42} end');

      const result = await service.reason<TestType>(
        'Test prompt',
        TestSchema,
        { module: 'test', inputData: {} }
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('test');
        expect(result.data.value).toBe(42);
      }
    });
  });

  describe('retry logic', () => {
    it('should retry on invalid JSON and succeed', async () => {
      mockClient.addResponse('not valid json');
      mockClient.addResponse('{"name": "test", "value": 42}');

      const result = await service.reason<TestType>(
        'Test prompt',
        TestSchema,
        { module: 'test', inputData: {} }
      );

      expect(result.success).toBe(true);
      expect(mockClient.callCount).toBe(2);
      if (result.success) {
        expect(result.metadata.attempts).toBe(2);
      }
    });

    it('should retry on schema validation failure', async () => {
      mockClient.addResponse('{"name": "", "value": 42}'); // Invalid: empty name
      mockClient.addResponse('{"name": "test", "value": -1}'); // Invalid: negative value
      mockClient.addResponse('{"name": "test", "value": 42}'); // Valid

      const result = await service.reason<TestType>(
        'Test prompt',
        TestSchema,
        { module: 'test', inputData: {} }
      );

      expect(result.success).toBe(true);
      expect(mockClient.callCount).toBe(3);
    });

    it('should fail after max retries', async () => {
      mockClient.addResponse('{"name": "", "value": 42}');
      mockClient.addResponse('{"name": "", "value": 42}');
      mockClient.addResponse('{"name": "", "value": 42}');

      const result = await service.reason<TestType>(
        'Test prompt',
        TestSchema,
        { module: 'test', inputData: {} }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.error).toBe('insufficient_data');
        expect(result.metadata.attempts).toBe(3);
      }
    });
  });

  describe('error handling', () => {
    it('should return error when client not configured', async () => {
      mockClient.setConfigured(false);

      const result = await service.reason<TestType>(
        'Test prompt',
        TestSchema,
        { module: 'test', inputData: {} }
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('not configured');
      }
    });

    it('should not retry on authentication errors', async () => {
      mockClient.addErrorResponse(
        new LLMError('Invalid API key', LLMErrorType.AUTHENTICATION)
      );

      const result = await service.reason<TestType>(
        'Test prompt',
        TestSchema,
        { module: 'test', inputData: {} }
      );

      expect(result.success).toBe(false);
      expect(mockClient.callCount).toBe(1); // Should not retry
    });

    it('should retry on server errors', async () => {
      mockClient.addErrorResponse(
        new LLMError('Server error', LLMErrorType.SERVER_ERROR)
      );
      mockClient.addResponse('{"name": "test", "value": 42}');

      const result = await service.reason<TestType>(
        'Test prompt',
        TestSchema,
        { module: 'test', inputData: {} }
      );

      expect(result.success).toBe(true);
      expect(mockClient.callCount).toBe(2);
    });
  });

  describe('metadata', () => {
    it('should track token usage', async () => {
      mockClient.addResponse('{"name": "test", "value": 42}');

      const result = await service.reason<TestType>(
        'Test prompt',
        TestSchema,
        { module: 'test', inputData: {} }
      );

      expect(result.success).toBe(true);
      expect(result.metadata.tokensUsed).toBeDefined();
      expect(result.metadata.tokensUsed?.input).toBe(100);
      expect(result.metadata.tokensUsed?.output).toBe(50);
    });

    it('should accumulate tokens across retries', async () => {
      mockClient.addResponse('invalid');
      mockClient.addResponse('{"name": "test", "value": 42}');

      const result = await service.reason<TestType>(
        'Test prompt',
        TestSchema,
        { module: 'test', inputData: {} }
      );

      expect(result.success).toBe(true);
      expect(result.metadata.tokensUsed?.input).toBe(200); // 2 calls
      expect(result.metadata.tokensUsed?.output).toBe(100);
    });

    it('should track duration', async () => {
      mockClient.addResponse('{"name": "test", "value": 42}');

      const result = await service.reason<TestType>(
        'Test prompt',
        TestSchema,
        { module: 'test', inputData: {} }
      );

      expect(result.metadata.totalDurationMs).toBeGreaterThanOrEqual(0);
    });
  });
});
