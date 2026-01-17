/**
 * Market Analysis Task Prompts
 * 
 * Deterministic prompt templates for the Market Analyst module.
 * Only structured data is injected - no free-form user text.
 */

import { MarketAnalysisInput } from '../schemas/marketAnalysis';

/**
 * JSON schema description for the AI to follow
 */
const OUTPUT_SCHEMA_DESCRIPTION = `{
  "business_model": "string - Clear description of how the company makes money and its core value proposition (min 20 chars)",
  "financial_health": {
    "summary": "string - Overall assessment of financial condition (min 10 chars)",
    "strengths": ["string array - Financial strengths, at least 1 item"],
    "weaknesses": ["string array - Financial weaknesses, at least 1 item"]
  },
  "competitive_edge": {
    "moat": "'strong' | 'moderate' | 'weak' - Competitive advantage durability",
    "explanation": "string - Why this moat rating was given (min 20 chars)"
  },
  "risks": {
    "short_term": ["string array - Risks in next 0-12 months, at least 1"],
    "long_term": ["string array - Risks beyond 12 months, at least 1"],
    "unknowns": ["string array - Key uncertainties and data gaps, at least 1"]
  },
  "confidence_level": "'low' | 'medium' | 'high' - Confidence in this analysis"
}`;

/**
 * Build the market analysis task prompt
 * 
 * This function creates a deterministic prompt from structured input.
 * No free-form text is accepted.
 */
export function buildMarketAnalysisPrompt(input: MarketAnalysisInput): string {
  const { ticker, horizon, style, financialData } = input;

  const horizonDescriptions = {
    short: '0-6 months',
    medium: '6-18 months',
    long: '18+ months'
  };

  const styleDescriptions = {
    growth: 'revenue expansion, market share growth, and scalability',
    value: 'undervaluation, margin of safety, and asset value',
    quality: 'business durability, consistent returns, and management quality'
  };

  return `## TASK: Market Analysis for ${ticker}

## ANALYSIS PARAMETERS:
- Ticker: ${ticker}
- Investment Horizon: ${horizon} (${horizonDescriptions[horizon]})
- Investment Style: ${style} - Focus on ${styleDescriptions[style]}

## FINANCIAL DATA PROVIDED:
- Sector: ${financialData.sector}
- Revenue Growth: ${financialData.revenue_growth}
- Debt-to-Equity Ratio: ${financialData.debt_equity}
- Free Cash Flow Margin: ${financialData.free_cash_flow_margin}
${financialData.market_cap ? `- Market Cap: ${financialData.market_cap}` : ''}
${financialData.pe_ratio ? `- P/E Ratio: ${financialData.pe_ratio}` : ''}
${financialData.profit_margin ? `- Profit Margin: ${financialData.profit_margin}` : ''}

## YOUR TASK:
Analyze this company based on the provided data and your knowledge. Focus on:
1. How the business makes money (business model)
2. Financial health (strengths AND weaknesses)
3. Competitive position and moat durability
4. Risks - what could go wrong (short-term, long-term, and unknowns)

Remember:
- NO buy/sell/hold recommendations
- NO price targets or predictions
- ACKNOWLEDGE any missing data in the "unknowns" section
- Be conservative in confidence assessment

## REQUIRED OUTPUT SCHEMA:
${OUTPUT_SCHEMA_DESCRIPTION}

## OUTPUT:
Output ONLY valid JSON matching this exact schema. No other text, no markdown, no code fences, no explanations before or after. Your entire response must be parseable JSON starting with { and ending with }. Every field is required.`;
}

/**
 * Get a prompt for retrying after validation failure
 */
export function buildRetryPrompt(
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
