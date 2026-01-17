/**
 * News Analysis Task Prompts
 * 
 * Deterministic prompt templates for the News Analyzer module.
 * Only structured data is injected - no free-form user text beyond the news content.
 */

import { NewsAnalysisInput } from '../schemas/newsAnalysis';

/**
 * JSON schema description for the AI to follow
 */
const OUTPUT_SCHEMA_DESCRIPTION = `{
  "short_term_impact": {
    "emotional": "string - How is the market likely to emotionally react to this news? (min 10 chars)",
    "business_relevance": "string - What is the actual business/operational relevance? (min 10 chars)"
  },
  "long_term_impact": {
    "signal_vs_noise": "string - Is this news a meaningful signal or just noise? Why? (min 10 chars)",
    "contrarian_risks": "string - What might contrarian investors see differently? (min 10 chars)"
  },
  "second_order_effects": ["string array - Indirect or cascading effects not immediately obvious, at least 1"],
  "risks_and_uncertainties": ["string array - Key unknowns, risks, and things that could invalidate this analysis, at least 1"],
  "confidence_level": "'low' | 'medium' | 'high' - How confident are you in this analysis?"
}`;

/**
 * Build the news analysis task prompt
 * 
 * This function creates a deterministic prompt from structured input.
 */
export function buildNewsAnalysisPrompt(input: NewsAnalysisInput): string {
  const { newsText, stockOrSector } = input;

  return `## TASK: News Impact Analysis for ${stockOrSector}

## CONTEXT:
You are analyzing a news item to understand its potential impact on ${stockOrSector}.
Focus on structured reasoning, not predictions or recommendations.

## NEWS TEXT:
${newsText}

## ANALYSIS TARGET:
- Stock/Sector: ${stockOrSector}

## YOUR TASK:
Analyze this news objectively. Focus on:
1. SHORT-TERM IMPACT: Separate emotional market reaction from actual business relevance
2. LONG-TERM IMPACT: Distinguish signal from noise, and consider contrarian perspectives
3. SECOND-ORDER EFFECTS: What indirect consequences might follow?
4. RISKS & UNCERTAINTIES: What could invalidate this analysis? What's unknown?

Remember:
- NO buy/sell/hold recommendations
- NO price targets or predictions
- ACKNOWLEDGE uncertainty and limitations
- Be conservative in confidence assessment
- Focus on reasoning, not advice

## REQUIRED OUTPUT SCHEMA:
${OUTPUT_SCHEMA_DESCRIPTION}

## OUTPUT:
Output ONLY valid JSON matching this exact schema. No other text, no markdown, no code fences, no explanations before or after. Your entire response must be parseable JSON starting with { and ending with }. Every field is required.`;
}

/**
 * Get a prompt for retrying after validation failure
 */
export function buildNewsRetryPrompt(
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
