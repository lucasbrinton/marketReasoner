/**
 * MarketAnalyst Tests
 */

import { MarketAnalyst } from '../services/MarketAnalyst';
import { ReasoningService, ReasoningResult } from '../services/ReasoningService';
import { LLMClient, LLMRequest, LLMResponse } from '../llm/LLMClient';
import { MarketAnalysis, MarketAnalysisInput } from '../schemas/marketAnalysis';
import { MOCK_AAPL } from '../data/mockData';

// Mock LLM Client
class MockLLMClient implements LLMClient {
  readonly provider = 'mock';
  private responseContent: string = '';

  setResponse(content: string): void {
    this.responseContent = content;
  }

  isConfigured(): boolean {
    return true;
  }

  async complete(request: LLMRequest): Promise<LLMResponse> {
    return {
      content: this.responseContent,
      model: 'mock-model',
      usage: { inputTokens: 100, outputTokens: 50 }
    };
  }
}

const validAnalysisResponse = JSON.stringify({
  business_model: 'Apple designs, manufactures, and sells consumer electronics, software, and services globally.',
  financial_health: {
    summary: 'Strong financial position with consistent profitability and cash flow.',
    strengths: ['High profit margins', 'Strong cash position', 'Consistent revenue growth'],
    weaknesses: ['Heavy reliance on iPhone revenue']
  },
  competitive_edge: {
    moat: 'strong',
    explanation: 'Strong brand loyalty and ecosystem lock-in create significant switching costs for consumers.'
  },
  risks: {
    short_term: ['Supply chain disruptions', 'Currency fluctuations'],
    long_term: ['Smartphone market saturation', 'Increased competition in services'],
    unknowns: ['Regulatory environment changes', 'AI strategy effectiveness']
  },
  confidence_level: 'high'
});

describe('MarketAnalyst', () => {
  let mockClient: MockLLMClient;
  let reasoningService: ReasoningService;
  let analyst: MarketAnalyst;

  beforeEach(() => {
    mockClient = new MockLLMClient();
    reasoningService = new ReasoningService(mockClient, {
      maxRetries: 2,
      baseDelayMs: 10
    });
    analyst = new MarketAnalyst(reasoningService);
  });

  describe('analyzeMarket', () => {
    it('should return valid analysis for correct input', async () => {
      mockClient.setResponse(validAnalysisResponse);

      const result = await analyst.analyzeMarket(MOCK_AAPL);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.business_model).toBeDefined();
        expect(result.data.financial_health.strengths.length).toBeGreaterThan(0);
        expect(result.data.competitive_edge.moat).toBe('strong');
        expect(result.data.confidence_level).toBe('high');
      }
    });

    it('should reject invalid input', async () => {
      const invalidInput = {
        ticker: '', // Invalid: empty
        horizon: 'long',
        style: 'growth',
        financialData: {
          revenue_growth: '12%',
          debt_equity: '0.8',
          free_cash_flow_margin: '18%',
          sector: 'Technology'
        }
      } as MarketAnalysisInput;

      const result = await analyst.analyzeMarket(invalidInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.error).toBe('insufficient_data');
        expect(result.error.message).toContain('Invalid input');
      }
    });

    it('should handle different horizons', async () => {
      mockClient.setResponse(validAnalysisResponse);

      const shortHorizonInput: MarketAnalysisInput = {
        ...MOCK_AAPL,
        horizon: 'short'
      };

      const result = await analyst.analyzeMarket(shortHorizonInput);
      expect(result.success).toBe(true);
    });

    it('should handle different styles', async () => {
      mockClient.setResponse(validAnalysisResponse);

      const valueStyleInput: MarketAnalysisInput = {
        ...MOCK_AAPL,
        style: 'value'
      };

      const result = await analyst.analyzeMarket(valueStyleInput);
      expect(result.success).toBe(true);
    });

    it('should return error on invalid AI response', async () => {
      mockClient.setResponse('{ invalid json }');

      const result = await analyst.analyzeMarket(MOCK_AAPL);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.error).toBe('insufficient_data');
      }
    });

    it('should validate all required fields in response', async () => {
      const incompleteResponse = JSON.stringify({
        business_model: 'Some business model',
        // Missing other required fields
      });
      mockClient.setResponse(incompleteResponse);

      const result = await analyst.analyzeMarket(MOCK_AAPL);

      expect(result.success).toBe(false);
    });
  });

  describe('analysis content validation', () => {
    it('should have non-empty risk arrays', async () => {
      mockClient.setResponse(validAnalysisResponse);

      const result = await analyst.analyzeMarket(MOCK_AAPL);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.risks.short_term.length).toBeGreaterThan(0);
        expect(result.data.risks.long_term.length).toBeGreaterThan(0);
        expect(result.data.risks.unknowns.length).toBeGreaterThan(0);
      }
    });

    it('should have valid moat enum value', async () => {
      mockClient.setResponse(validAnalysisResponse);

      const result = await analyst.analyzeMarket(MOCK_AAPL);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(['strong', 'moderate', 'weak']).toContain(result.data.competitive_edge.moat);
      }
    });

    it('should have valid confidence level', async () => {
      mockClient.setResponse(validAnalysisResponse);

      const result = await analyst.analyzeMarket(MOCK_AAPL);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(['low', 'medium', 'high']).toContain(result.data.confidence_level);
      }
    });
  });
});
