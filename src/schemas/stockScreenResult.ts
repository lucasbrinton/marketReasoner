/**
 * Stock Screen Result Schemas
 * 
 * Zod schemas for AI Stock Screener input/output validation.
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Input Schema
// ─────────────────────────────────────────────────────────────────────────────

export const StockScreenInputSchema = z.object({
  ticker: z.string().min(1).max(10).toUpperCase()
});

export type StockScreenInput = z.infer<typeof StockScreenInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Output Schema
// ─────────────────────────────────────────────────────────────────────────────

export const CriterionResultSchema = z.object({
  pass: z.boolean(),
  explanation: z.string()
});

export const StockScreenResultSchema = z.object({
  valuation: CriterionResultSchema,
  growth_prospects: CriterionResultSchema,
  financial_health: CriterionResultSchema,
  competitive_advantage: CriterionResultSchema,
  risk_factors: CriterionResultSchema,
  overall_assessment: z.string(),
  weaknesses: z.array(z.string()),
  confidence_level: z.enum(['low', 'medium', 'high'])
});

export type StockScreenResult = z.infer<typeof StockScreenResultSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Service Result Type
// ─────────────────────────────────────────────────────────────────────────────

export type StockScreenServiceResult = 
  | { success: true; data: StockScreenResult }
  | { 
      success: false; 
      error: { 
        error: string; 
        message: string; 
        details?: { attempts: number; lastError?: string };
      };
    };
