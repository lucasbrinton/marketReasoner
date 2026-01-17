/**
 * Stock Screener Service
 * 
 * AI-powered stock screening against fundamental quality criteria.
 * Fifth AI-powered module in MarketMind.
 * 
 * IMPORTANT: This module NEVER provides buy/sell recommendations or predictions.
 */

import { ReasoningService } from './ReasoningService';
import { 
  StockScreenInput, 
  StockScreenInputSchema,
  StockScreenResult,
  StockScreenResultSchema,
  StockScreenServiceResult
} from '../schemas/stockScreenResult';
import { buildStockScreenPrompt } from '../prompts/stockScreenerPrompts';
import { getMockData } from '../data/mockData';
import { logger } from '../utils/logger';

export class StockScreener {
  private readonly reasoningService: ReasoningService;
  private readonly moduleName = 'StockScreener';

  constructor(reasoningService: ReasoningService) {
    this.reasoningService = reasoningService;
  }

  /**
   * Screen a stock against quality criteria
   */
  async screenStock(input: StockScreenInput): Promise<StockScreenServiceResult> {
    logger.info('Starting stock screening', {
      ticker: input.ticker
    });

    // Validate input
    const inputValidation = StockScreenInputSchema.safeParse(input);
    if (!inputValidation.success) {
      const errors = inputValidation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      logger.error('Invalid input for stock screening', { errors });
      
      return {
        success: false,
        error: {
          error: 'insufficient_data',
          message: `Invalid input: ${errors.join('; ')}`,
          details: { attempts: 0, lastError: 'Input validation failed' }
        }
      };
    }

    // Try to get mock data for additional context
    const mockData = getMockData(input.ticker);
    const dataContext = mockData ? mockData.financialData : undefined;

    // Build the task prompt
    const taskPrompt = buildStockScreenPrompt(input, dataContext);

    // Execute reasoning
    const result = await this.reasoningService.reason<StockScreenResult>(
      taskPrompt,
      StockScreenResultSchema,
      {
        module: this.moduleName,
        inputData: input
      }
    );

    if (result.success) {
      const passCount = [
        result.data.valuation.pass,
        result.data.growth_prospects.pass,
        result.data.financial_health.pass,
        result.data.competitive_advantage.pass,
        result.data.risk_factors.pass
      ].filter(Boolean).length;

      logger.info('Stock screening completed successfully', {
        ticker: input.ticker,
        passCount: `${passCount}/5`,
        weaknessCount: result.data.weaknesses.length,
        confidence: result.data.confidence_level,
        attempts: result.metadata.attempts,
        durationMs: result.metadata.totalDurationMs
      });

      return {
        success: true,
        data: result.data
      };
    } else {
      logger.warn('Stock screening failed', {
        ticker: input.ticker,
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
 * Create a StockScreener instance with default configuration
 */
export function createStockScreener(reasoningService: ReasoningService): StockScreener {
  return new StockScreener(reasoningService);
}
