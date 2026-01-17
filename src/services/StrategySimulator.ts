/**
 * Strategy Simulator Service
 * 
 * Simulates strategy behavior across market regimes using AI reasoning.
 * Fourth AI-powered module in MarketMind.
 * 
 * IMPORTANT: This module NEVER provides specific trade signals or predictions.
 */

import { ReasoningService } from './ReasoningService';
import { 
  StrategySimulationInput, 
  StrategySimulationInputSchema,
  StrategySimulation,
  StrategySimulationSchema,
  StrategySimulationResult
} from '../schemas/strategySimulation';
import { buildStrategySimulationPrompt } from '../prompts/strategySimulatorPrompts';
import { logger } from '../utils/logger';

export class StrategySimulator {
  private readonly reasoningService: ReasoningService;
  private readonly moduleName = 'StrategySimulator';

  constructor(reasoningService: ReasoningService) {
    this.reasoningService = reasoningService;
  }

  /**
   * Simulate strategy behavior across market regimes
   */
  async simulateStrategy(input: StrategySimulationInput): Promise<StrategySimulationResult> {
    logger.info('Starting strategy simulation', {
      strategyType: input.strategyType,
      riskLevel: input.riskLevel
    });

    // Validate input
    const inputValidation = StrategySimulationInputSchema.safeParse(input);
    if (!inputValidation.success) {
      const errors = inputValidation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      logger.error('Invalid input for strategy simulation', { errors });
      
      return {
        success: false,
        error: {
          error: 'insufficient_data',
          message: `Invalid input: ${errors.join('; ')}`,
          details: { attempts: 0, lastError: 'Input validation failed' }
        }
      };
    }

    // Build the task prompt
    const taskPrompt = buildStrategySimulationPrompt(input);

    // Execute reasoning
    const result = await this.reasoningService.reason<StrategySimulation>(
      taskPrompt,
      StrategySimulationSchema,
      {
        module: this.moduleName,
        inputData: input
      }
    );

    if (result.success) {
      logger.info('Strategy simulation completed successfully', {
        strategyType: input.strategyType,
        riskLevel: input.riskLevel,
        confidence: result.data.confidence_level,
        failureModesCount: result.data.failure_modes.length,
        emotionalTrapsCount: result.data.emotional_traps.length,
        attempts: result.metadata.attempts,
        durationMs: result.metadata.totalDurationMs
      });

      return {
        success: true,
        data: result.data
      };
    } else {
      logger.warn('Strategy simulation failed', {
        strategyType: input.strategyType,
        riskLevel: input.riskLevel,
        error: result.error.message,
        attempts: result.metadata.attempts
      });

      return {
        success: false,
        error: result.error
      };
    }
  }
}

/**
 * Create a StrategySimulator instance with default configuration
 */
export function createStrategySimulator(reasoningService: ReasoningService): StrategySimulator {
  return new StrategySimulator(reasoningService);
}
