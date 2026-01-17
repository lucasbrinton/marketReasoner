/**
 * Daily Routine Schema
 * 
 * Defines the structure for AI-generated daily market routines.
 */

import { z } from 'zod';

// Input schema (optional preferences)
export const DailyRoutineInputSchema = z.object({
  preferences: z.string().optional()
});

export type DailyRoutineInput = z.infer<typeof DailyRoutineInputSchema>;

// Routine steps schema
export const RoutineStepsSchema = z.object({
  step1: z.string().describe('First step in the daily routine'),
  step2: z.string().describe('Second step in the daily routine'),
  step3: z.string().describe('Third step in the daily routine'),
  step4: z.string().describe('Fourth step in the daily routine'),
  step5: z.string().describe('Fifth step in the daily routine'),
  step6: z.string().optional().describe('Optional sixth step'),
  step7: z.string().optional().describe('Optional seventh step')
});

// Main result schema
export const DailyRoutineResultSchema = z.object({
  routine_steps: RoutineStepsSchema.describe('Sequential steps for a daily market analysis routine'),
  time_allocation: z.string().describe('Total estimated time for the routine (e.g., "10 minutes total")'),
  tips_for_consistency: z.array(z.string()).describe('Tips to maintain consistency with the routine'),
  potential_pitfalls: z.array(z.string()).describe('Common mistakes or pitfalls to avoid'),
  confidence_level: z.enum(['low', 'medium', 'high']).describe('Confidence in the routine effectiveness')
});

export type DailyRoutineResult = z.infer<typeof DailyRoutineResultSchema>;

// Service result type (success/error pattern)
export type DailyRoutineServiceResult = 
  | { success: true; data: DailyRoutineResult; model: string }
  | { success: false; error: { error: string; message: string; details?: { attempts: number; lastError?: string } } };
