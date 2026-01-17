/**
 * MarketMind Express Server
 * 
 * API server for the MarketMind reasoning platform.
 * Exposes the MarketAnalyst service via REST endpoints.
 */

import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

import { env, isProd } from './config/env';
import { createLLMClient, getLLMProviderStatus } from './llm/factory';
import { ReasoningService } from './services/ReasoningService';
import { MarketAnalyst } from './services/MarketAnalyst';
import { NewsAnalyzer } from './services/NewsAnalyzer';
import { RiskManager } from './services/RiskManager';
import { StrategySimulator } from './services/StrategySimulator';
import { StockScreener } from './services/StockScreener';
import { DailyBrain } from './services/DailyBrain';
import { getMockData, getAvailableMockTickers } from './data/mockData';
import { logger } from './utils/logger';

// App version
const APP_VERSION = '1.0.0';

// ============================================================================
// Configuration
// ============================================================================

const PORT = env.PORT;
const FRONTEND_ORIGIN = env.FRONTEND_ORIGIN;

// ============================================================================
// Initialize Services
// ============================================================================

const llmClient = createLLMClient();
const reasoningService = new ReasoningService(llmClient, {
  maxRetries: 3,
  baseDelayMs: 1000
});
const marketAnalyst = new MarketAnalyst(reasoningService);
const newsAnalyzer = new NewsAnalyzer(reasoningService);
const riskManager = new RiskManager(reasoningService);
const strategySimulator = new StrategySimulator(reasoningService);
const stockScreener = new StockScreener(reasoningService);
const dailyBrain = new DailyBrain(reasoningService);

// ============================================================================
// Express App Setup
// ============================================================================

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: isProd // Enable CSP in production
}));

// CORS - stricter in production
const corsOrigins = isProd 
  ? [FRONTEND_ORIGIN]
  : [FRONTEND_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    error: 'rate_limit_exceeded',
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !isProd && req.path === '/api/health' // Skip health in dev
});

// Apply rate limiting to all /api routes
app.use('/api', apiLimiter);

// Parse JSON bodies
app.use(express.json());

// ============================================================================
// Request Logging Middleware
// ============================================================================

app.use((req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Log request
  logger.info('API Request', {
    method: req.method,
    path: req.path,
    body: req.body,
    userAgent: req.get('user-agent'),
    ip: req.ip
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('API Response', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: duration
    });
  });

  next();
});

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
// API Routes
// ============================================================================

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    llmConfigured: llmClient.isConfigured()
  });
});

/**
 * Status endpoint for deployment monitoring
 */
app.get('/api/status', (_req: Request, res: Response) => {
  const providerStatus = getLLMProviderStatus();
  res.json({
    status: 'ok',
    version: APP_VERSION,
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      llm: providerStatus.active ? 'configured' : 'not_configured',
      provider: providerStatus.active || 'none'
    }
  });
});

/**
 * Get available tickers
 */
app.get('/api/tickers', (_req: Request, res: Response) => {
  const tickers = getAvailableMockTickers().map(ticker => {
    const data = getMockData(ticker);
    return {
      ticker,
      sector: data?.financialData.sector,
      defaultHorizon: data?.horizon,
      defaultStyle: data?.style
    };
  });
  res.json({ tickers });
});

/**
 * Run market analysis
 */
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

/**
 * Run news impact analysis
 */
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

/**
 * Run risk profile analysis
 */
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

/**
 * Run strategy simulation
 */
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

/**
 * Run stock screening
 */
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

/**
 * Generate daily market routine
 */
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

// ============================================================================
// Error Handling
// ============================================================================

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'not_found',
    message: 'Endpoint not found'
  });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({
    error: 'internal_error',
    message: 'An unexpected error occurred'
  });
});

// ============================================================================
// Start Server
// ============================================================================

app.listen(PORT, () => {
  const providerStatus = getLLMProviderStatus();
  logger.info(`MarketMind API server running on port ${PORT}`);
  logger.info(`Frontend origin allowed: ${FRONTEND_ORIGIN}`);
  logger.info(`LLM provider: ${providerStatus.active ?? 'none'}`);
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                  MarketMind API Server                       ║
╚══════════════════════════════════════════════════════════════╝

  Server:           http://localhost:${PORT}
  Health:           http://localhost:${PORT}/api/health
  Tickers:          http://localhost:${PORT}/api/tickers
  Analyze:          POST http://localhost:${PORT}/api/analyze
  News Impact:      POST http://localhost:${PORT}/api/analyze-news
  Risk Profile:     POST http://localhost:${PORT}/api/analyze-risk
  Strategy Sim:     POST http://localhost:${PORT}/api/simulate-strategy
  Stock Screener:   POST http://localhost:${PORT}/api/screen-stock
  Daily Routine:    POST http://localhost:${PORT}/api/generate-routine

  LLM Provider: ${providerStatus.active ? `✅ ${providerStatus.active.toUpperCase()}` : '❌ Not configured'}
  ${!providerStatus.active ? 'Set ANTHROPIC_API_KEY to enable AI features' : ''}

  Press Ctrl+C to stop
`);
});

export default app;
