/**
 * Daily Brain Prompts
 * 
 * Deterministic prompt templates for generating daily market routines.
 */

import { DailyRoutineInput } from '../schemas/dailyRoutine';

const OUTPUT_SCHEMA_DESCRIPTION = `
{
  "routine_steps": {
    "step1": "string - First step (e.g., 'Check major index futures for overnight direction')",
    "step2": "string - Second step (e.g., 'Scan top financial headlines for market-moving news')",
    "step3": "string - Third step (e.g., 'Review your watchlist for significant price changes')",
    "step4": "string - Fourth step (e.g., 'Analyze key technical levels on charts')",
    "step5": "string - Fifth step (e.g., 'Evaluate current portfolio risk exposure')",
    "step6": "string (optional) - Sixth step",
    "step7": "string (optional) - Seventh step"
  },
  "time_allocation": "string - Total time estimate (e.g., '10 minutes total')",
  "tips_for_consistency": ["string - Tips for maintaining the routine daily"],
  "potential_pitfalls": ["string - Common mistakes to avoid"],
  "confidence_level": "low | medium | high"
}`;

export function buildDailyBrainPrompt(input: { preferences?: string }): string {
  const preferencesSection = input.preferences 
    ? `\n\nUser preferences to consider:\n${input.preferences}`
    : '';

  return `You are a market routine architect specializing in creating efficient, habit-forming daily routines for market participants.

Your task is to generate a simple, consistent daily routine for reviewing markets. This is NOT about making predictions or giving advice—it's about building a sustainable habit of market awareness.

IMPORTANT CONSTRAINTS:
- Focus on OBSERVATION and AWARENESS, not trading decisions
- Keep the routine simple and achievable (5-7 steps maximum)
- Time should be realistic (under 15 minutes total)
- Steps should be concrete and actionable
- Emphasize consistency over complexity
- No investment advice or buy/sell recommendations
- No specific stock picks or price targets${preferencesSection}

Generate a daily market review routine following this exact JSON schema:
${OUTPUT_SCHEMA_DESCRIPTION}

Respond ONLY with valid JSON matching the schema above. No markdown, no explanations, no preamble.`;
}

// Mock input for testing
export const MOCK_DAILY_INPUT: DailyRoutineInput = {
  preferences: ''
};
