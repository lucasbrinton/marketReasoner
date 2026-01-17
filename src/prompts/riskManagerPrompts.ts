/**
 * Risk Manager Task Prompts
 * 
 * Deterministic prompt templates for the Risk Manager module.
 * Only structured data is injected - no free-form user text beyond goals.
 */

import { RiskProfileInput } from '../schemas/riskProfile';

/**
 * JSON schema description for the AI to follow
 */
const OUTPUT_SCHEMA_DESCRIPTION = `{
  "exposure_bands": {
    "equities": "string - Target allocation range for equities (e.g., '50-60%')",
    "fixed_income": "string - Target allocation range for fixed income (e.g., '20-30%')",
    "alternatives": "string - Target allocation range for alternatives (e.g., '5-10%')",
    "cash": "string - Target allocation range for cash/equivalents (e.g., '5-15%')"
  },
  "risk_limits": ["string array - Specific risk limits and guardrails, at least 1"],
  "time_horizons": {
    "short": "string - How to think about short-term (0-2 years) (min 10 chars)",
    "medium": "string - How to think about medium-term (2-10 years) (min 10 chars)",
    "long": "string - How to think about long-term (10+ years) (min 10 chars)"
  },
  "rebalancing_logic": "string - When and how to consider rebalancing (min 20 chars)",
  "rules_for_inaction": ["string array - When NOT to act or change strategy, at least 1"],
  "confidence_level": "'low' | 'medium' | 'high' - Confidence in this risk framework"
}`;

/**
 * Build the risk profile analysis prompt
 */
export function buildRiskProfilePrompt(input: RiskProfileInput): string {
  const { age, goals, drawdownTolerance, capitalStability } = input;

  return `## TASK: Personal Risk Framework Generation

## CONTEXT:
You are building a personal risk management framework for an individual investor.
Focus on discipline, risk limits, and behavioral guardrails — NOT specific asset picks.

## INPUT PROFILE:
- Age: ${age}
- Investment Goals: ${goals}
- Maximum Acceptable Drawdown: ${drawdownTolerance}%
- Capital Stability Requirement: ${capitalStability}

## YOUR TASK:
Generate a structured risk framework that helps this investor maintain discipline.

Focus on:
1. EXPOSURE BANDS: Reasonable allocation ranges (not exact numbers) based on profile
2. RISK LIMITS: Specific guardrails to prevent excessive risk-taking
3. TIME HORIZONS: How to think about different investment timeframes
4. REBALANCING LOGIC: When to consider portfolio adjustments
5. RULES FOR INACTION: When NOT to make changes (emotional market periods, etc.)

Remember:
- NO specific asset or fund recommendations
- NO price targets or return predictions
- ACKNOWLEDGE uncertainty and personal circumstances vary
- Focus on PROCESS and DISCIPLINE, not outcomes
- Be conservative in confidence assessment
- Ranges should be appropriate for the drawdown tolerance

## REQUIRED OUTPUT SCHEMA:
${OUTPUT_SCHEMA_DESCRIPTION}

## OUTPUT:
Output ONLY valid JSON matching this exact schema. No other text, no markdown, no code fences, no explanations before or after. Your entire response must be parseable JSON starting with { and ending with }. Every field is required.`;
}

/**
 * Get a prompt for retrying after validation failure
 */
export function buildRiskRetryPrompt(
  originalPrompt: string,
  previousOutput: string,
  validationErrors: string[]
): string {
  return `${originalPrompt}

## PREVIOUS ATTEMPT FAILED VALIDATION

Your previous output:
${previousOutput}

Validation errors:
${validationErrors.map((e) => `- ${e}`).join('\n')}

Please try again. Output ONLY valid JSON matching the exact schema. No additional text.`;
}
