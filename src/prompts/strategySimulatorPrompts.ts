/**
 * Strategy Simulator Prompt Templates
 * 
 * Deterministic prompts for strategy reasoning simulation.
 * Focus on conceptual behavior, risks, and uncertainties—no optimization or signals.
 */

import { StrategySimulationInput } from '../schemas/strategySimulation';

const STRATEGY_TYPE_DESCRIPTIONS: Record<StrategySimulationInput['strategyType'], string> = {
  swing: 'Swing trading: Holding positions for days to weeks, capturing medium-term price movements',
  intraday: 'Intraday trading: Opening and closing positions within the same trading day, no overnight exposure',
  position: 'Position trading: Holding positions for weeks to months, focusing on major trends and fundamentals'
};

const RISK_LEVEL_DESCRIPTIONS: Record<StrategySimulationInput['riskLevel'], string> = {
  low: 'Conservative risk tolerance: Prioritizes capital preservation, smaller position sizes, tight stops',
  medium: 'Moderate risk tolerance: Balanced approach between growth and protection, standard position sizing',
  high: 'Aggressive risk tolerance: Accepts larger drawdowns for higher potential returns, larger positions'
};

const OUTPUT_SCHEMA_DESCRIPTION = `
{
  "behavior_in_regimes": {
    "trend": "How this strategy typically performs in trending markets (up or down)",
    "range": "How this strategy typically performs in range-bound/sideways markets",
    "high_volatility": "How this strategy typically performs during high volatility periods"
  },
  "failure_modes": ["Common ways this strategy fails", "At least 3-5 specific failure scenarios"],
  "emotional_traps": ["Psychological pitfalls traders face with this strategy", "At least 3-4 traps"],
  "risk_profile": "Overall risk characterization of this strategy approach",
  "unknowns": ["Uncertainties and unpredictable factors that affect this strategy", "At least 3-4 unknowns"],
  "confidence_level": "low" | "medium" | "high"
}`;

export function buildStrategySimulationPrompt(input: StrategySimulationInput): string {
  const strategyDesc = STRATEGY_TYPE_DESCRIPTIONS[input.strategyType];
  const riskDesc = RISK_LEVEL_DESCRIPTIONS[input.riskLevel];

  return `You are a trading strategy reasoning engine. Your task is to simulate how a given trading strategy behaves under different market conditions, identify failure modes, emotional traps, and unknowns.

## STRATEGY PROFILE
- **Strategy Type**: ${input.strategyType.toUpperCase()}
  ${strategyDesc}
- **Risk Level**: ${input.riskLevel.toUpperCase()}
  ${riskDesc}

## YOUR TASK
Analyze this strategy combination conceptually. Focus on:
1. How the strategy behaves in different market regimes (trending, ranging, volatile)
2. Common failure modes and when the strategy breaks down
3. Emotional and psychological traps traders fall into with this approach
4. Overall risk characterization
5. Unknowns and uncertainties that cannot be predicted

## IMPORTANT CONSTRAINTS
- Do NOT provide specific trade signals, entry/exit points, or timing recommendations
- Do NOT suggest backtesting parameters or optimization targets
- Do NOT make predictions about future market movements
- Focus ONLY on conceptual reasoning about strategy behavior and risks
- Be realistic about limitations and uncertainties
- Acknowledge that past patterns may not repeat

## OUTPUT FORMAT
Return ONLY valid JSON matching this schema (no markdown, no explanation):
${OUTPUT_SCHEMA_DESCRIPTION}

Provide thoughtful, specific analysis. Each failure mode and emotional trap should be distinct and actionable for self-awareness.`;
}

// Mock input for testing
export const MOCK_STRATEGY_INPUT: StrategySimulationInput = {
  strategyType: 'swing',
  riskLevel: 'medium'
};
