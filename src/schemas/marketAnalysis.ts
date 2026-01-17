/**
 * Market Analysis Schemas
 * 
 * Zod schemas for validating AI outputs from the Market Analyst module.
 * All AI responses must conform to these schemas.
 */

import { z } from 'zod';

/**
 * Competitive moat strength levels
 */
export const MoatStrengthSchema = z.enum(['strong', 'moderate', 'weak']);
export type MoatStrength = z.infer<typeof MoatStrengthSchema>;

/**
 * Confidence level for analysis
 */
export const ConfidenceLevelSchema = z.enum(['low', 'medium', 'high']);
export type ConfidenceLevel = z.infer<typeof ConfidenceLevelSchema>;

/**
 * Financial health assessment
 */
export const FinancialHealthSchema = z.object({
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  strengths: z.array(z.string().min(5)).min(1, 'At least one strength required'),
  weaknesses: z.array(z.string().min(5)).min(1, 'At least one weakness required')
});
export type FinancialHealth = z.infer<typeof FinancialHealthSchema>;

/**
 * Competitive edge assessment
 */
export const CompetitiveEdgeSchema = z.object({
  moat: MoatStrengthSchema,
  explanation: z.string().min(20, 'Explanation must be at least 20 characters')
});
export type CompetitiveEdge = z.infer<typeof CompetitiveEdgeSchema>;

/**
 * Risk assessment
 */
export const RisksSchema = z.object({
  short_term: z.array(z.string().min(5)).min(1, 'At least one short-term risk required'),
  long_term: z.array(z.string().min(5)).min(1, 'At least one long-term risk required'),
  unknowns: z.array(z.string().min(5)).min(1, 'At least one unknown required')
});
export type Risks = z.infer<typeof RisksSchema>;

/**
 * Complete Market Analysis output schema
 */
export const MarketAnalysisSchema = z.object({
  business_model: z.string().min(20, 'Business model description must be at least 20 characters'),
  financial_health: FinancialHealthSchema,
  competitive_edge: CompetitiveEdgeSchema,
  risks: RisksSchema,
  confidence_level: ConfidenceLevelSchema
});
export type MarketAnalysis = z.infer<typeof MarketAnalysisSchema>;

/**
 * Input data for market analysis
 */
export const MarketAnalysisInputSchema = z.object({
  ticker: z.string().min(1).max(10),
  horizon: z.enum(['short', 'medium', 'long']),
  style: z.enum(['growth', 'value', 'quality']),
  financialData: z.object({
    revenue_growth: z.string(),
    debt_equity: z.string(),
    free_cash_flow_margin: z.string(),
    sector: z.string(),
    market_cap: z.string().optional(),
    pe_ratio: z.string().optional(),
    profit_margin: z.string().optional()
  })
});
export type MarketAnalysisInput = z.infer<typeof MarketAnalysisInputSchema>;

/**
 * Error response for insufficient data or failed analysis
 */
export const InsufficientDataResponseSchema = z.object({
  error: z.literal('insufficient_data'),
  message: z.string(),
  details: z.object({
    attempts: z.number(),
    lastError: z.string().optional()
  }).optional()
});
export type InsufficientDataResponse = z.infer<typeof InsufficientDataResponseSchema>;

/**
 * Union type for analysis result
 */
export type MarketAnalysisResult = 
  | { success: true; data: MarketAnalysis }
  | { success: false; error: InsufficientDataResponse };

/**
 * Validate and parse market analysis output
 */
export function parseMarketAnalysis(raw: unknown): z.SafeParseReturnType<unknown, MarketAnalysis> {
  return MarketAnalysisSchema.safeParse(raw);
}

/**
 * Create a structured insufficient data response
 */
export function createInsufficientDataResponse(
  message: string,
  attempts?: number,
  lastError?: string
): InsufficientDataResponse {
  return {
    error: 'insufficient_data',
    message,
    details: attempts !== undefined ? { attempts, lastError } : undefined
  };
}
