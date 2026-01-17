/**
 * Strategy Simulation Schemas
 * 
 * Zod schemas for Strategy Reasoning Simulator input/output validation.
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Input Schema
// ─────────────────────────────────────────────────────────────────────────────

export const StrategySimulationInputSchema = z.object({
  strategyType: z.enum(['swing', 'intraday', 'position']),
  riskLevel: z.enum(['low', 'medium', 'high'])
});

export type StrategySimulationInput = z.infer<typeof StrategySimulationInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Output Schema
// ─────────────────────────────────────────────────────────────────────────────

export const BehaviorInRegimesSchema = z.object({
  trend: z.string(),
  range: z.string(),
  high_volatility: z.string()
});

export const StrategySimulationSchema = z.object({
  behavior_in_regimes: BehaviorInRegimesSchema,
  failure_modes: z.array(z.string()),
  emotional_traps: z.array(z.string()),
  risk_profile: z.string(),
  unknowns: z.array(z.string()),
  confidence_level: z.enum(['low', 'medium', 'high'])
});

export type StrategySimulation = z.infer<typeof StrategySimulationSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Result Type
// ─────────────────────────────────────────────────────────────────────────────

export type StrategySimulationResult = 
  | { success: true; data: StrategySimulation }
  | { 
      success: false; 
      error: { 
        error: string; 
        message: string; 
        details?: { attempts: number; lastError?: string };
      };
    };
