/**
 * Risk Profile Schema
 * 
 * Zod schemas for the Risk Manager module inputs and outputs.
 * Focus on discipline/risk limits, no specific asset recommendations.
 */

import { z } from 'zod';

// Capital stability levels
export const CapitalStabilitySchema = z.enum(['low', 'medium', 'high']);
export type CapitalStability = z.infer<typeof CapitalStabilitySchema>;

// Confidence level for risk analysis
export const RiskConfidenceLevelSchema = z.enum(['low', 'medium', 'high']);
export type RiskConfidenceLevel = z.infer<typeof RiskConfidenceLevelSchema>;

// Risk Profile Input Schema
export const RiskProfileInputSchema = z.object({
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
  capitalStability: CapitalStabilitySchema
});

export type RiskProfileInput = z.infer<typeof RiskProfileInputSchema>;

// Exposure Bands Schema
export const ExposureBandsSchema = z.object({
  equities: z.string().min(1),
  fixed_income: z.string().min(1),
  alternatives: z.string().min(1),
  cash: z.string().min(1)
});

// Time Horizons Schema
export const TimeHorizonsSchema = z.object({
  short: z.string().min(10),
  medium: z.string().min(10),
  long: z.string().min(10)
});

// Risk Profile Output Schema
export const RiskProfileSchema = z.object({
  exposure_bands: ExposureBandsSchema,
  risk_limits: z.array(z.string().min(5)).min(1),
  time_horizons: TimeHorizonsSchema,
  rebalancing_logic: z.string().min(20),
  rules_for_inaction: z.array(z.string().min(5)).min(1),
  confidence_level: RiskConfidenceLevelSchema
});

export type RiskProfile = z.infer<typeof RiskProfileSchema>;

// Result type with success/error handling
export type RiskProfileResult = 
  | { success: true; data: RiskProfile }
  | { success: false; error: { error: string; message: string; details?: unknown } };

/**
 * Helper to create a validated RiskProfile input
 */
export function createRiskProfileInput(input: unknown): RiskProfileInput | null {
  const result = RiskProfileInputSchema.safeParse(input);
  return result.success ? result.data : null;
}

/**
 * Helper to validate RiskProfile output
 */
export function validateRiskProfile(output: unknown): RiskProfile | null {
  const result = RiskProfileSchema.safeParse(output);
  return result.success ? result.data : null;
}
