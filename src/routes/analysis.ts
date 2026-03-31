import { Express, Request, Response } from 'express';
import { z } from 'zod';
import { LLMClient } from '../llm/LLMClient';
import { MarketAnalyst } from '../services/MarketAnalyst';
import { NewsAnalyzer } from '../services/NewsAnalyzer';
import { RiskManager } from '../services/RiskManager';
import { StrategySimulator } from '../services/StrategySimulator';
import { StockScreener } from '../services/StockScreener';
import { DailyBrain } from '../services/DailyBrain';
import { getMockData, getAvailableMockTickers } from '../data/mockData';
import { logger } from '../utils/logger';

// ============================================================================
// Request Validation Schemas
// ============================================================================

const AnalyzeRequestSchema = z.object({
  ticker: z.string().min(1).max(10).toUpperCase(),
  horizon: z.enum(['short', 'medium', 'long']),
  style: z.enum(['growth', 'value', 'quality'])
});

const AnalyzeNewsRequestSchema = z.object({
  newsText: z.string().min(20, 'News text must be at least 20 characters').max(10000, 'News text must be at most 10000 characters'),
  stockOrSector: z.string().min(1, 'Stock or sector is required').max(100, 'Stock or sector must be at most 100 characters')
});

const AnalyzeRiskRequestSchema = z.object({
  age: z.number().int().min(18, 'Age must be at least 18').max(100, 'Age must be at most 100'),
  goals: z.string().min(10, 'Goals must be at least 10 characters').max(500, 'Goals must be at most 500 characters'),
  drawdownTolerance: z.number().min(0, 'Drawdown tolerance must be at least 0%').max(100, 'Drawdown tolerance must be at most 100%'),
  capitalStability: z.enum(['low', 'medium', 'high'])
});

const SimulateStrategyRequestSchema = z.object({
  strategyType: z.enum(['swing', 'intraday', 'position']),
  riskLevel: z.enum(['low', 'medium', 'high'])
});

const ScreenStockRequestSchema = z.object({
  ticker: z.string().min(1, 'Ticker is required').max(10, 'Ticker must be at most 10 characters').toUpperCase()
});

const GenerateRoutineRequestSchema = z.object({
  preferences: z.string().optional().default('')
});

// ============================================================================
// Service Types
// ============================================================================

export interface AnalysisServices {
  llmClient: LLMClient;
  marketAnalyst: MarketAnalyst;
  newsAnalyzer: NewsAnalyzer;
  riskManager: RiskManager;
  strategySimulator: StrategySimulator;
  stockScreener: StockScreener;
  dailyBrain: DailyBrain;
}

// ============================================================================
// Route Registration
// ============================================================================

export function registerAnalysisRoutes(app: Express, services: AnalysisServices): void {
  const {
    llmClient,
    marketAnalyst,
    newsAnalyzer,
    riskManager,
    strategySimulator,
    stockScreener,
    dailyBrain
  } = services;

  app.post('/api/analyze', async (req: Request, res: Response) => {
    try {
      // Validate request body
      const parseResult = AnalyzeRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        const errors = parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        logger.warn('Invalid analyze request', { errors });
        return res.status(400).json({
          error: 'validation_error',
          message: 'Invalid request parameters',
          details: errors
        });
      }

      const { ticker, horizon, style } = parseResult.data;

      // Look up mock data for ticker
      const mockData = getMockData(ticker);

      if (!mockData) {
        logger.warn('Unknown ticker requested', { ticker });
        return res.status(400).json({
          error: 'unknown_ticker',
          message: `Unknown ticker: ${ticker}. Available tickers: ${getAvailableMockTickers().join(', ')}`,
          availableTickers: getAvailableMockTickers()
        });
      }

      // Check if LLM is configured
      if (!llmClient.isConfigured()) {
        logger.error('LLM client not configured');
        return res.status(503).json({
          error: 'service_unavailable',
          message: 'AI service is not configured. Please set ANTHROPIC_API_KEY.'
        });
      }

      // Run analysis with requested parameters (override mock defaults)
      const analysisInput = {
        ...mockData,
        ticker,
        horizon,
        style
      };

      logger.info('Starting analysis', { ticker, horizon, style });

      const result = await marketAnalyst.analyzeMarket(analysisInput);

      if (result.success) {
        return res.json({
          success: true,
          data: result.data,
          meta: {
            ticker,
            horizon,
            style,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        logger.warn('Analysis failed', { ticker, error: result.error });
        return res.status(500).json({
          error: 'analysis_failed',
          message: result.error.message,
          details: result.error.details
        });
      }

    } catch (error) {
      logger.error('Unexpected error in /api/analyze', { error });
      return res.status(500).json({
        error: 'internal_error',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  });

  app.post('/api/analyze-news', async (req: Request, res: Response) => {
    try {
      // Validate request body
      const parseResult = AnalyzeNewsRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        const errors = parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        logger.warn('Invalid analyze-news request', { errors });
        return res.status(400).json({
          error: 'validation_error',
          message: 'Invalid request parameters',
          details: errors
        });
      }

      const { newsText, stockOrSector } = parseResult.data;

      // Check if LLM is configured
      if (!llmClient.isConfigured()) {
        logger.error('LLM client not configured');
        return res.status(503).json({
          error: 'service_unavailable',
          message: 'AI service is not configured. Please set ANTHROPIC_API_KEY.'
        });
      }

      logger.info('Starting news analysis', { stockOrSector, newsTextLength: newsText.length });

      const result = await newsAnalyzer.analyzeNews({ newsText, stockOrSector });

      if (result.success) {
        return res.json({
          success: true,
          data: result.data,
          meta: {
            stockOrSector,
            newsTextLength: newsText.length,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        logger.warn('News analysis failed', { stockOrSector, error: result.error });
        return res.status(500).json({
          error: 'analysis_failed',
          message: result.error?.message ?? 'Analysis failed',
          details: result.error?.details
        });
      }

    } catch (error) {
      logger.error('Unexpected error in /api/analyze-news', { error });
      return res.status(500).json({
        error: 'internal_error',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  });

  app.post('/api/analyze-risk', async (req: Request, res: Response) => {
    try {
      // Validate request body
      const parseResult = AnalyzeRiskRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        const errors = parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        logger.warn('Invalid analyze-risk request', { errors });
        return res.status(400).json({
          error: 'validation_error',
          message: 'Invalid request parameters',
          details: errors
        });
      }

      const { age, goals, drawdownTolerance, capitalStability } = parseResult.data;

      // Check if LLM is configured
      if (!llmClient.isConfigured()) {
        logger.error('LLM client not configured');
        return res.status(503).json({
          error: 'service_unavailable',
          message: 'AI service is not configured. Please set ANTHROPIC_API_KEY.'
        });
      }

      logger.info('Starting risk profile analysis', { age, drawdownTolerance, capitalStability });

      const result = await riskManager.analyzeRisk({ age, goals, drawdownTolerance, capitalStability });

      if (result.success) {
        return res.json({
          success: true,
          data: result.data,
          meta: {
            age,
            drawdownTolerance,
            capitalStability,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        logger.warn('Risk analysis failed', { age, error: result.error });
        return res.status(500).json({
          error: 'analysis_failed',
          message: result.error?.message ?? 'Analysis failed',
          details: result.error?.details
        });
      }

    } catch (error) {
      logger.error('Unexpected error in /api/analyze-risk', { error });
      return res.status(500).json({
        error: 'internal_error',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  });

  app.post('/api/simulate-strategy', async (req: Request, res: Response) => {
    try {
      // Validate request body
      const parseResult = SimulateStrategyRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        const errors = parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        logger.warn('Invalid simulate-strategy request', { errors });
        return res.status(400).json({
          error: 'validation_error',
          message: 'Invalid request parameters',
          details: errors
        });
      }

      const { strategyType, riskLevel } = parseResult.data;

      // Check if LLM is configured
      if (!llmClient.isConfigured()) {
        logger.error('LLM client not configured');
        return res.status(503).json({
          error: 'service_unavailable',
          message: 'AI service is not configured. Please set ANTHROPIC_API_KEY.'
        });
      }

      logger.info('Starting strategy simulation', { strategyType, riskLevel });

      const result = await strategySimulator.simulateStrategy({ strategyType, riskLevel });

      if (result.success) {
        return res.json({
          success: true,
          data: result.data,
          meta: {
            strategyType,
            riskLevel,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        logger.warn('Strategy simulation failed', { strategyType, riskLevel, error: result.error });
        return res.status(500).json({
          error: 'simulation_failed',
          message: result.error?.message ?? 'Simulation failed',
          details: result.error?.details
        });
      }

    } catch (error) {
      logger.error('Unexpected error in /api/simulate-strategy', { error });
      return res.status(500).json({
        error: 'internal_error',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  });

  app.post('/api/screen-stock', async (req: Request, res: Response) => {
    try {
      // Validate request body
      const parseResult = ScreenStockRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        const errors = parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        logger.warn('Invalid screen-stock request', { errors });
        return res.status(400).json({
          error: 'validation_error',
          message: 'Invalid request parameters',
          details: errors
        });
      }

      const { ticker } = parseResult.data;

      // Check if LLM is configured
      if (!llmClient.isConfigured()) {
        logger.error('LLM client not configured');
        return res.status(503).json({
          error: 'service_unavailable',
          message: 'AI service is not configured. Please set ANTHROPIC_API_KEY.'
        });
      }

      logger.info('Starting stock screening', { ticker });

      const result = await stockScreener.screenStock({ ticker });

      if (result.success) {
        return res.json({
          success: true,
          data: result.data,
          meta: {
            ticker,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        logger.warn('Stock screening failed', { ticker, error: result.error });
        return res.status(500).json({
          error: 'screening_failed',
          message: result.error?.message ?? 'Screening failed',
          details: result.error?.details
        });
      }

    } catch (error) {
      logger.error('Unexpected error in /api/screen-stock', { error });
      return res.status(500).json({
        error: 'internal_error',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  });

  app.post('/api/generate-routine', async (req: Request, res: Response) => {
    try {
      // Validate request body
      const parseResult = GenerateRoutineRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        const errors = parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        logger.warn('Invalid generate-routine request', { errors });
        return res.status(400).json({
          error: 'validation_error',
          message: 'Invalid request parameters',
          details: errors
        });
      }

      const { preferences } = parseResult.data;

      // Check if LLM is configured
      if (!llmClient.isConfigured()) {
        logger.error('LLM client not configured');
        return res.status(503).json({
          error: 'service_unavailable',
          message: 'AI service is not configured. Please set ANTHROPIC_API_KEY.'
        });
      }

      logger.info('Starting routine generation', { preferences: preferences || '(none)' });

      const result = await dailyBrain.generateRoutine({ preferences });

      if (result.success) {
        return res.json({
          success: true,
          data: result.data,
          meta: {
            timestamp: new Date().toISOString(),
            model: result.model,
            preferences: preferences || ''
          }
        });
      } else {
        logger.warn('Routine generation failed', { error: result.error.message });
        return res.status(500).json({
          error: 'generation_failed',
          message: result.error.message,
          details: result.error.details
        });
      }

    } catch (error) {
      logger.error('Unexpected error in /api/generate-routine', { error });
      return res.status(500).json({
        error: 'internal_error',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  });
}
