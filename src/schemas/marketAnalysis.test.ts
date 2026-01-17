/**
 * Market Analysis Schema Tests
 */

import {
  MarketAnalysisSchema,
  MarketAnalysisInputSchema,
  parseMarketAnalysis,
  createInsufficientDataResponse,
  MoatStrengthSchema,
  ConfidenceLevelSchema
} from '../schemas/marketAnalysis';

describe('MarketAnalysisSchema', () => {
  const validAnalysis = {
    business_model: 'Apple designs, manufactures, and sells consumer electronics, software, and services globally.',
    financial_health: {
      summary: 'Strong financial position with consistent profitability.',
      strengths: ['High profit margins', 'Strong cash position'],
      weaknesses: ['Reliance on iPhone revenue']
    },
    competitive_edge: {
      moat: 'strong',
      explanation: 'Strong brand loyalty and ecosystem lock-in create significant switching costs.'
    },
    risks: {
      short_term: ['Supply chain disruptions'],
      long_term: ['Smartphone market saturation'],
      unknowns: ['Regulatory environment changes']
    },
    confidence_level: 'high'
  };

  it('should validate a correct analysis object', () => {
    const result = MarketAnalysisSchema.safeParse(validAnalysis);
    expect(result.success).toBe(true);
  });

  it('should reject missing business_model', () => {
    const invalid = { ...validAnalysis, business_model: undefined };
    const result = MarketAnalysisSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject business_model that is too short', () => {
    const invalid = { ...validAnalysis, business_model: 'Short' };
    const result = MarketAnalysisSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject empty strengths array', () => {
    const invalid = {
      ...validAnalysis,
      financial_health: { ...validAnalysis.financial_health, strengths: [] }
    };
    const result = MarketAnalysisSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject empty weaknesses array', () => {
    const invalid = {
      ...validAnalysis,
      financial_health: { ...validAnalysis.financial_health, weaknesses: [] }
    };
    const result = MarketAnalysisSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject invalid moat value', () => {
    const invalid = {
      ...validAnalysis,
      competitive_edge: { ...validAnalysis.competitive_edge, moat: 'invalid' }
    };
    const result = MarketAnalysisSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject invalid confidence_level', () => {
    const invalid = { ...validAnalysis, confidence_level: 'very_high' };
    const result = MarketAnalysisSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject empty risks arrays', () => {
    const invalid = {
      ...validAnalysis,
      risks: { short_term: [], long_term: [], unknowns: [] }
    };
    const result = MarketAnalysisSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('MarketAnalysisInputSchema', () => {
  const validInput = {
    ticker: 'AAPL',
    horizon: 'long',
    style: 'growth',
    financialData: {
      revenue_growth: '12%',
      debt_equity: '0.8',
      free_cash_flow_margin: '18%',
      sector: 'Technology'
    }
  };

  it('should validate correct input', () => {
    const result = MarketAnalysisInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('should reject empty ticker', () => {
    const invalid = { ...validInput, ticker: '' };
    const result = MarketAnalysisInputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject invalid horizon', () => {
    const invalid = { ...validInput, horizon: 'very_long' };
    const result = MarketAnalysisInputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject invalid style', () => {
    const invalid = { ...validInput, style: 'momentum' };
    const result = MarketAnalysisInputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should accept optional financial data fields', () => {
    const withOptional = {
      ...validInput,
      financialData: {
        ...validInput.financialData,
        market_cap: '$2.8T',
        pe_ratio: '28.5'
      }
    };
    const result = MarketAnalysisInputSchema.safeParse(withOptional);
    expect(result.success).toBe(true);
  });
});

describe('MoatStrengthSchema', () => {
  it('should accept valid moat values', () => {
    expect(MoatStrengthSchema.safeParse('strong').success).toBe(true);
    expect(MoatStrengthSchema.safeParse('moderate').success).toBe(true);
    expect(MoatStrengthSchema.safeParse('weak').success).toBe(true);
  });

  it('should reject invalid moat values', () => {
    expect(MoatStrengthSchema.safeParse('none').success).toBe(false);
    expect(MoatStrengthSchema.safeParse('very_strong').success).toBe(false);
  });
});

describe('ConfidenceLevelSchema', () => {
  it('should accept valid confidence levels', () => {
    expect(ConfidenceLevelSchema.safeParse('low').success).toBe(true);
    expect(ConfidenceLevelSchema.safeParse('medium').success).toBe(true);
    expect(ConfidenceLevelSchema.safeParse('high').success).toBe(true);
  });

  it('should reject invalid confidence levels', () => {
    expect(ConfidenceLevelSchema.safeParse('very_low').success).toBe(false);
    expect(ConfidenceLevelSchema.safeParse('very_high').success).toBe(false);
  });
});

describe('parseMarketAnalysis', () => {
  it('should return success for valid data', () => {
    const validData = {
      business_model: 'A company that sells products and services.',
      financial_health: {
        summary: 'Good overall health.',
        strengths: ['Strong cash flow'],
        weaknesses: ['High debt levels']
      },
      competitive_edge: {
        moat: 'moderate',
        explanation: 'Moderate competitive advantages from brand recognition.'
      },
      risks: {
        short_term: ['Market volatility'],
        long_term: ['Industry disruption'],
        unknowns: ['Management changes']
      },
      confidence_level: 'medium'
    };

    const result = parseMarketAnalysis(validData);
    expect(result.success).toBe(true);
  });

  it('should return failure for invalid data', () => {
    const result = parseMarketAnalysis({ invalid: 'data' });
    expect(result.success).toBe(false);
  });
});

describe('createInsufficientDataResponse', () => {
  it('should create a valid insufficient data response', () => {
    const response = createInsufficientDataResponse('Test message');
    expect(response.error).toBe('insufficient_data');
    expect(response.message).toBe('Test message');
  });

  it('should include details when provided', () => {
    const response = createInsufficientDataResponse('Test', 3, 'Last error');
    expect(response.details?.attempts).toBe(3);
    expect(response.details?.lastError).toBe('Last error');
  });
});
