/**
 * Stock Screener Prompt Templates
 * 
 * Deterministic prompts for AI-powered stock screening.
 * Focus on reasoning-first analysis with pass/fail criteria—no buy/sell recommendations.
 */

import { StockScreenInput } from '../schemas/stockScreenResult';

const OUTPUT_SCHEMA_DESCRIPTION = `
{
  "valuation": {
    "pass": true/false,
    "explanation": "Detailed reasoning about valuation metrics (P/E, P/S, P/B, etc.)"
  },
  "growth_prospects": {
    "pass": true/false,
    "explanation": "Detailed reasoning about revenue/earnings growth trajectory"
  },
  "financial_health": {
    "pass": true/false,
    "explanation": "Detailed reasoning about balance sheet strength, debt, cash flow"
  },
  "competitive_advantage": {
    "pass": true/false,
    "explanation": "Detailed reasoning about moat, market position, barriers to entry"
  },
  "risk_factors": {
    "pass": true/false,
    "explanation": "Detailed reasoning about key risks (pass=manageable, fail=concerning)"
  },
  "overall_assessment": "Holistic summary of the stock's quality based on above criteria",
  "weaknesses": ["Specific weakness 1", "Specific weakness 2", "At least 3 weaknesses"],
  "confidence_level": "low" | "medium" | "high"
}`;

export function buildStockScreenPrompt(input: StockScreenInput, mockData?: Record<string, unknown>): string {
  const dataSection = mockData 
    ? `\n## AVAILABLE DATA\n${JSON.stringify(mockData, null, 2)}`
    : '\n## NOTE\nUse your knowledge of this company as of your training cutoff. Acknowledge data limitations.';

  return `You are an AI stock screening engine. Your task is to evaluate a stock against fundamental quality criteria and provide reasoning-first analysis.

## STOCK TO SCREEN
Ticker: ${input.ticker}
${dataSection}

## SCREENING CRITERIA
Evaluate the stock against these five criteria, providing detailed reasoning for each:

1. **Valuation**: Is the stock reasonably valued based on P/E, P/S, P/B, PEG ratios relative to sector and historical norms?
2. **Growth Prospects**: Does the company show sustainable revenue and earnings growth potential?
3. **Financial Health**: Is the balance sheet strong? Manageable debt? Positive free cash flow?
4. **Competitive Advantage**: Does the company have a durable moat? Strong market position?
5. **Risk Factors**: Are key risks manageable or are there red flags?

## IMPORTANT CONSTRAINTS
- This is a SCREENING exercise, not a recommendation
- Do NOT provide buy, sell, or hold recommendations
- Do NOT predict future price movements
- Focus on REASONING and EVIDENCE for each criterion
- Be intellectually honest about limitations and uncertainties
- ALWAYS identify at least 3 specific weaknesses, even for high-quality companies
- A "pass" means the criterion is satisfactory, not perfect
- A "fail" means significant concerns exist for that criterion

## OUTPUT FORMAT
Return ONLY valid JSON matching this schema (no markdown, no explanation):
${OUTPUT_SCHEMA_DESCRIPTION}

Provide thorough, balanced analysis. Every company has weaknesses—identify them clearly.`;
}

// Mock input for testing
export const MOCK_SCREENER_INPUT: StockScreenInput = {
  ticker: 'AAPL'
};
