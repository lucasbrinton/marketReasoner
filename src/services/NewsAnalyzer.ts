/**
 * News Analyzer Module
 * 
 * AI-powered news impact analysis for investment research.
 * Analyzes news items to understand potential market impact,
 * separating emotional reactions from business fundamentals.
 * 
 * IMPORTANT: This module NEVER provides buy/sell recommendations or price targets.
 */

import { ReasoningService, ReasoningResult } from './ReasoningService';
import {
  NewsAnalysis,
  NewsAnalysisInput,
  NewsAnalysisInputSchema,
  NewsAnalysisSchema,
  NewsAnalysisResult
} from '../schemas/newsAnalysis';
import { buildNewsAnalysisPrompt } from '../prompts/newsAnalysisPrompts';
import { logger } from '../utils/logger';

/**
 * NewsAnalyzer - Structured news impact analysis service
 */
export class NewsAnalyzer {
  private readonly reasoningService: ReasoningService;
  private readonly moduleName = 'NewsAnalyzer';

  constructor(reasoningService: ReasoningService) {
    this.reasoningService = reasoningService;
  }

  /**
   * Analyze news impact based on structured input
   * 
   * @param input - Structured analysis input (newsText, stockOrSector)
   * @returns Structured analysis result or error
   */
  async analyzeNews(input: NewsAnalysisInput): Promise<NewsAnalysisResult> {
    logger.info('Starting news analysis', {
      stockOrSector: input.stockOrSector,
      newsTextLength: input.newsText.length
    });

    // Validate input
    const inputValidation = NewsAnalysisInputSchema.safeParse(input);
    if (!inputValidation.success) {
      const errors = inputValidation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      logger.error('Invalid input for news analysis', { errors });
      
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
    const taskPrompt = buildNewsAnalysisPrompt(input);

    // Execute reasoning
    const result = await this.reasoningService.reason<NewsAnalysis>(
      taskPrompt,
      NewsAnalysisSchema,
      {
        module: this.moduleName,
        inputData: input
      }
    );

    if (result.success) {
      logger.info('News analysis completed successfully', {
        stockOrSector: input.stockOrSector,
        confidence: result.data.confidence_level,
        secondOrderEffectsCount: result.data.second_order_effects.length,
        attempts: result.metadata.attempts,
        durationMs: result.metadata.totalDurationMs
      });

      return {
        success: true,
        data: result.data
      };
    } else {
      logger.warn('News analysis failed', {
        stockOrSector: input.stockOrSector,
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
 * Create a NewsAnalyzer instance with default configuration
 */
export function createNewsAnalyzer(reasoningService: ReasoningService): NewsAnalyzer {
  return new NewsAnalyzer(reasoningService);
}
