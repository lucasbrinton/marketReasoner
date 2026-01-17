/**
 * API Response Mock Utilities
 *
 * Provides type-safe mock data for testing components that consume
 * AI-generated responses from the MarketMind backend.
 *
 * These mocks mirror the exact structure returned by the backend,
 * ensuring frontend components handle real-world data correctly.
 */

import type {
  AnalysisResponse,
  MarketAnalysis,
  NewsAnalysis,
  NewsAnalysisResponse,
  RiskProfile,
  RiskProfileResponse,
  StockScreenResponse,
  StockScreenResult,
  StrategySimulation,
  StrategySimulationResponse,
} from '../types';

/**
 * Mock market analysis data
 * Simulates AI response for stock analysis
 */
export const mockMarketAnalysis: MarketAnalysis = {
  business_model: 'Consumer electronics and services company with strong ecosystem lock-in.',
  financial_health: {
    summary: 'Excellent financial position with strong cash reserves.',
    strengths: ['Strong cash flow', 'Low debt-to-equity ratio', 'Consistent revenue growth'],
    weaknesses: ['High dependency on iPhone revenue', 'Supply chain concentration'],
  },
  competitive_edge: {
    moat: 'strong',
    explanation: 'Powerful brand loyalty and integrated ecosystem create high switching costs.',
  },
  risks: {
    short_term: ['Supply chain disruptions', 'Currency headwinds'],
    long_term: ['Regulatory pressure', 'Market saturation in developed markets'],
    unknowns: ['AI strategy execution', 'New product category success'],
  },
  confidence_level: 'high',
};

/**
 * Mock full API response for market analysis
 */
export const mockAnalysisResponse: AnalysisResponse = {
  success: true,
  data: mockMarketAnalysis,
  meta: {
    ticker: 'AAPL',
    horizon: 'long',
    style: 'growth',
    timestamp: new Date().toISOString(),
  },
};

/**
 * Mock news analysis data
 * Simulates AI response for news impact analysis
 */
export const mockNewsAnalysis: NewsAnalysis = {
  short_term_impact: {
    emotional: 'Initial market reaction likely to be positive but measured.',
    business_relevance: 'Direct impact on quarterly revenue expectations.',
  },
  long_term_impact: {
    signal_vs_noise: 'Strong signal - represents meaningful strategic shift.',
    contrarian_risks: 'Market may be overestimating execution capability.',
  },
  second_order_effects: [
    'Competitor response likely within 6 months',
    'May trigger regulatory scrutiny',
  ],
  risks_and_uncertainties: [
    'Execution risk on new initiative',
    'Consumer adoption rate uncertain',
  ],
  confidence_level: 'medium',
};

/**
 * Mock full API response for news analysis
 */
export const mockNewsResponse: NewsAnalysisResponse = {
  success: true,
  data: mockNewsAnalysis,
  meta: {
    stockOrSector: 'AAPL',
    newsTextLength: 500,
    timestamp: new Date().toISOString(),
  },
};

/**
 * Mock risk profile data
 * Simulates AI response for risk assessment
 */
export const mockRiskProfile: RiskProfile = {
  exposure_bands: {
    equities: '60-70%',
    fixed_income: '20-25%',
    alternatives: '5-10%',
    cash: '5%',
  },
  risk_limits: ['Max single position: 5%', 'Max sector exposure: 25%'],
  time_horizons: {
    short: 'Maintain liquidity buffer',
    medium: 'Rebalance quarterly',
    long: 'Focus on growth allocation',
  },
  rebalancing_logic: 'Rebalance when allocation drifts >5% from targets.',
  rules_for_inaction: ['Avoid reacting to daily volatility', 'Ignore short-term news cycles'],
  confidence_level: 'high',
};

/**
 * Mock full API response for risk profile
 */
export const mockRiskResponse: RiskProfileResponse = {
  success: true,
  data: mockRiskProfile,
  meta: {
    age: 35,
    drawdownTolerance: 20,
    capitalStability: 'medium',
    timestamp: new Date().toISOString(),
  },
};

/**
 * Mock strategy simulation data
 * Simulates AI response for strategy testing
 */
export const mockStrategySimulation: StrategySimulation = {
  behavior_in_regimes: {
    trend: 'Performs well in sustained uptrends.',
    range: 'May generate false signals in choppy markets.',
    high_volatility: 'Risk of whipsaws and larger drawdowns.',
  },
  failure_modes: ['Gap moves against position', 'Extended drawdown periods'],
  emotional_traps: ['Revenge trading after losses', 'Overconfidence after wins'],
  risk_profile: 'Moderate risk with potential for 15-20% drawdowns.',
  unknowns: ['Performance in unprecedented market conditions'],
  confidence_level: 'medium',
};

/**
 * Mock full API response for strategy simulation
 */
export const mockStrategyResponse: StrategySimulationResponse = {
  success: true,
  data: mockStrategySimulation,
  meta: {
    strategyType: 'swing',
    riskLevel: 'medium',
    timestamp: new Date().toISOString(),
  },
};

/**
 * Mock stock screen result
 * Simulates AI response for stock screening
 */
export const mockStockScreen: StockScreenResult = {
  valuation: {
    pass: true,
    explanation: 'P/E ratio reasonable relative to growth rate.',
  },
  growth_prospects: {
    pass: true,
    explanation: 'Strong revenue growth trajectory expected.',
  },
  financial_health: {
    pass: true,
    explanation: 'Solid balance sheet with manageable debt.',
  },
  competitive_advantage: {
    pass: true,
    explanation: 'Clear moat from brand and ecosystem.',
  },
  risk_factors: {
    pass: false,
    explanation: 'Concentration risk in key product lines.',
  },
  overall_assessment: 'Strong candidate with some concentration concerns.',
  weaknesses: ['Revenue concentration', 'Regulatory exposure'],
  confidence_level: 'high',
};

/**
 * Mock full API response for stock screening
 */
export const mockScreenResponse: StockScreenResponse = {
  success: true,
  data: mockStockScreen,
  meta: {
    ticker: 'AAPL',
    timestamp: new Date().toISOString(),
  },
};
