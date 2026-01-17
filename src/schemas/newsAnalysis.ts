/**
 * News Analysis Schemas
 * 
 * Zod schemas for validating AI outputs from the News Analyzer module.
 * All AI responses must conform to these schemas.
 */

import { z } from 'zod';

/**
 * Confidence level for analysis
 */
export const NewsConfidenceLevelSchema = z.enum(['low', 'medium', 'high']);
export type NewsConfidenceLevel = z.infer<typeof NewsConfidenceLevelSchema>;

/**
 * Short-term impact assessment
 */
export const ShortTermImpactSchema = z.object({
  emotional: z.string().min(10, 'Emotional assessment must be at least 10 characters'),
  business_relevance: z.string().min(10, 'Business relevance must be at least 10 characters')
});
export type ShortTermImpact = z.infer<typeof ShortTermImpactSchema>;

/**
 * Long-term impact assessment
 */
export const LongTermImpactSchema = z.object({
  signal_vs_noise: z.string().min(10, 'Signal vs noise assessment must be at least 10 characters'),
  contrarian_risks: z.string().min(10, 'Contrarian risks must be at least 10 characters')
});
export type LongTermImpact = z.infer<typeof LongTermImpactSchema>;

/**
 * Complete News Analysis output schema
 */
export const NewsAnalysisSchema = z.object({
  short_term_impact: ShortTermImpactSchema,
  long_term_impact: LongTermImpactSchema,
  second_order_effects: z.array(z.string().min(5)).min(1, 'At least one second-order effect required'),
  risks_and_uncertainties: z.array(z.string().min(5)).min(1, 'At least one risk/uncertainty required'),
  confidence_level: NewsConfidenceLevelSchema
});
export type NewsAnalysis = z.infer<typeof NewsAnalysisSchema>;

/**
 * Input data for news analysis
 */
export const NewsAnalysisInputSchema = z.object({
  newsText: z.string().min(10, 'News text must be at least 10 characters').max(5000, 'News text must be at most 5000 characters'),
  stockOrSector: z.string().min(1, 'Stock or sector is required').max(50, 'Stock or sector must be at most 50 characters')
});
export type NewsAnalysisInput = z.infer<typeof NewsAnalysisInputSchema>;

/**
 * Result wrapper for news analysis
 */
export interface NewsAnalysisResult {
  success: boolean;
  data?: NewsAnalysis;
  error?: {
    error: string;
    message: string;
    details?: { attempts: number; lastError?: string };
  };
}

/**
 * Parse and validate news analysis response
 */
export function parseNewsAnalysis(data: unknown): { success: true; data: NewsAnalysis } | { success: false; errors: string[] } {
  const result = NewsAnalysisSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
  };
}

/**
 * Create a standardized error response
 */
export function createNewsInsufficientDataResponse(
  message: string,
  details?: { attempts: number; lastError?: string }
): NewsAnalysisResult['error'] {
  return {
    error: 'insufficient_data',
    message,
    details
  };
}
