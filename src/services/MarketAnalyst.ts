import { ReasoningService } from './ReasoningService';
import {
  MarketAnalysis,
  MarketAnalysisInput,
  MarketAnalysisInputSchema,
  MarketAnalysisSchema,
  MarketAnalysisResult
} from '../schemas/marketAnalysis';
import { buildMarketAnalysisPrompt } from '../prompts/marketAnalysisPrompts';
import { logger } from '../utils/logger';

export class MarketAnalyst {
  private readonly reasoningService: ReasoningService;
  private readonly moduleName = 'MarketAnalyst';

  constructor(reasoningService: ReasoningService) {
    this.reasoningService = reasoningService;
  }

  async analyzeMarket(input: MarketAnalysisInput): Promise<MarketAnalysisResult> {
    logger.info('Starting market analysis', {
      ticker: input.ticker,
      horizon: input.horizon,
      style: input.style
    });

    // Validate input
    const inputValidation = MarketAnalysisInputSchema.safeParse(input);
    if (!inputValidation.success) {
      const errors = inputValidation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      logger.error('Invalid input for market analysis', { errors });
      
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
    const taskPrompt = buildMarketAnalysisPrompt(input);

    // Execute reasoning
    const result = await this.reasoningService.reason<MarketAnalysis>(
      taskPrompt,
      MarketAnalysisSchema,
      {
        module: this.moduleName,
        inputData: input
      }
    );

    if (result.success) {
      logger.info('Market analysis completed successfully', {
        ticker: input.ticker,
        confidence: result.data.confidence_level,
        moat: result.data.competitive_edge.moat,
        attempts: result.metadata.attempts,
        durationMs: result.metadata.totalDurationMs
      });

      return {
        success: true,
        data: result.data
      };
    } else {
      logger.warn('Market analysis failed', {
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
