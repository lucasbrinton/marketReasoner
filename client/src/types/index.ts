import { z } from 'zod';

export const AnalysisRequestSchema = z.object({
  ticker: z.string().min(1, 'Ticker is required').max(10),
  horizon: z.enum(['short', 'medium', 'long'], {
    required_error: 'Horizon is required'
  }),
  style: z.enum(['growth', 'value', 'quality'], {
    required_error: 'Style is required'
  })
});

export type AnalysisRequest = z.infer<typeof AnalysisRequestSchema>;

export const NewsAnalysisRequestSchema = z.object({
  newsText: z.string()
    .min(20, 'News text must be at least 20 characters')
    .max(10000, 'News text must be at most 10000 characters'),
  stockOrSector: z.string()
    .min(1, 'Stock or sector is required')
    .max(100, 'Stock or sector must be at most 100 characters')
});

export type NewsAnalysisRequest = z.infer<typeof NewsAnalysisRequestSchema>;

export const RiskProfileRequestSchema = z.object({
  age: z.number()
    .int()
    .min(18, 'Age must be at least 18')
    .max(100, 'Age must be at most 100'),
  goals: z.string()
    .min(10, 'Goals must be at least 10 characters')
    .max(500, 'Goals must be at most 500 characters'),
  drawdownTolerance: z.number()
    .min(0, 'Drawdown tolerance must be at least 0%')
    .max(100, 'Drawdown tolerance must be at most 100%'),
  capitalStability: z.enum(['low', 'medium', 'high'], {
    required_error: 'Capital stability is required'
  })
});

export type RiskProfileRequest = z.infer<typeof RiskProfileRequestSchema>;

export const StrategySimulationRequestSchema = z.object({
  strategyType: z.enum(['swing', 'intraday', 'position'], {
    required_error: 'Strategy type is required'
  }),
  riskLevel: z.enum(['low', 'medium', 'high'], {
    required_error: 'Risk level is required'
  })
});

export type StrategySimulationRequest = z.infer<typeof StrategySimulationRequestSchema>;

export const StockScreenRequestSchema = z.object({
  ticker: z.string()
    .min(1, 'Ticker is required')
    .max(10, 'Ticker must be at most 10 characters')
});

export type StockScreenRequest = z.infer<typeof StockScreenRequestSchema>;

export interface MarketAnalysis {
  business_model: string;
  financial_health: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
  };
  competitive_edge: {
    moat: 'strong' | 'moderate' | 'weak';
    explanation: string;
  };
  risks: {
    short_term: string[];
    long_term: string[];
    unknowns: string[];
  };
  confidence_level: 'low' | 'medium' | 'high';
}

export interface NewsAnalysis {
  short_term_impact: {
    emotional: string;
    business_relevance: string;
  };
  long_term_impact: {
    signal_vs_noise: string;
    contrarian_risks: string;
  };
  second_order_effects: string[];
  risks_and_uncertainties: string[];
  confidence_level: 'low' | 'medium' | 'high';
}

export interface RiskProfile {
  exposure_bands: {
    equities: string;
    fixed_income: string;
    alternatives: string;
    cash: string;
  };
  risk_limits: string[];
  time_horizons: {
    short: string;
    medium: string;
    long: string;
  };
  rebalancing_logic: string;
  rules_for_inaction: string[];
  confidence_level: 'low' | 'medium' | 'high';
}

export interface StrategySimulation {
  behavior_in_regimes: {
    trend: string;
    range: string;
    high_volatility: string;
  };
  failure_modes: string[];
  emotional_traps: string[];
  risk_profile: string;
  unknowns: string[];
  confidence_level: 'low' | 'medium' | 'high';
}

export interface CriterionResult {
  pass: boolean;
  explanation: string;
}

export interface StockScreenResult {
  valuation: CriterionResult;
  growth_prospects: CriterionResult;
  financial_health: CriterionResult;
  competitive_advantage: CriterionResult;
  risk_factors: CriterionResult;
  overall_assessment: string;
  weaknesses: string[];
  confidence_level: 'low' | 'medium' | 'high';
}

export interface AnalysisResponse {
  success: true;
  data: MarketAnalysis;
  meta: {
    ticker: string;
    horizon: string;
    style: string;
    timestamp: string;
  };
}

export interface NewsAnalysisResponse {
  success: true;
  data: NewsAnalysis;
  meta: {
    stockOrSector: string;
    newsTextLength: number;
    timestamp: string;
  };
}

export interface RiskProfileResponse {
  success: true;
  data: RiskProfile;
  meta: {
    age: number;
    drawdownTolerance: number;
    capitalStability: 'low' | 'medium' | 'high';
    timestamp: string;
  };
}

export interface StrategySimulationResponse {
  success: true;
  data: StrategySimulation;
  meta: {
    strategyType: 'swing' | 'intraday' | 'position';
    riskLevel: 'low' | 'medium' | 'high';
    timestamp: string;
  };
}

export interface StockScreenResponse {
  success: true;
  data: StockScreenResult;
  meta: {
    ticker: string;
    timestamp: string;
  };
}

export interface ApiError {
  error: string;
  message: string;
  details?: string[] | { attempts: number; lastError?: string };
  availableTickers?: string[];
}

export interface TickerInfo {
  ticker: string;
  sector?: string;
  defaultHorizon?: string;
  defaultStyle?: string;
}

export const AVAILABLE_TICKERS = ['AAPL', 'MSFT', 'JPM', 'NVDA', 'WEAK'] as const;

export const HORIZON_OPTIONS = [
  { value: 'short', label: 'Short (0-6 months)' },
  { value: 'medium', label: 'Medium (6-18 months)' },
  { value: 'long', label: 'Long (18+ months)' }
] as const;

export const STYLE_OPTIONS = [
  { value: 'growth', label: 'Growth' },
  { value: 'value', label: 'Value' },
  { value: 'quality', label: 'Quality' }
] as const;

export const CAPITAL_STABILITY_OPTIONS = [
  { value: 'low', label: 'Low - Can tolerate significant volatility' },
  { value: 'medium', label: 'Medium - Moderate stability preferred' },
  { value: 'high', label: 'High - Prioritize capital preservation' }
] as const;

export const STRATEGY_TYPE_OPTIONS = [
  { value: 'swing', label: 'Swing Trading' },
  { value: 'intraday', label: 'Intraday Trading' },
  { value: 'position', label: 'Position Trading' }
] as const;

export const RISK_LEVEL_OPTIONS = [
  { value: 'low', label: 'Low Risk' },
  { value: 'medium', label: 'Medium Risk' },
  { value: 'high', label: 'High Risk' }
] as const;

// ============================================================================
// Daily Routine Types
// ============================================================================

export interface DailyRoutineRequest {
  preferences?: string;
}

export interface RoutineSteps {
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  step6?: string;
  step7?: string;
}

export interface DailyRoutineResult {
  routine_steps: RoutineSteps;
  time_allocation: string;
  tips_for_consistency: string[];
  potential_pitfalls: string[];
  confidence_level: 'low' | 'medium' | 'high';
}

export interface DailyRoutineResponse {
  success: true;
  data: DailyRoutineResult;
  meta: {
    timestamp: string;
    model: string;
    preferences: string;
  };
}
