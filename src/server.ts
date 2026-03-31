import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { env, isProd } from './config/env';
import { createLLMClient, getLLMProviderStatus } from './llm/factory';
import { ReasoningService } from './services/ReasoningService';
import { MarketAnalyst } from './services/MarketAnalyst';
import { NewsAnalyzer } from './services/NewsAnalyzer';
import { RiskManager } from './services/RiskManager';
import { StrategySimulator } from './services/StrategySimulator';
import { StockScreener } from './services/StockScreener';
import { DailyBrain } from './services/DailyBrain';
import { logger } from './utils/logger';
import { registerHealthRoutes } from './routes/health';
import { registerAnalysisRoutes } from './routes/analysis';

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
    bodySize: JSON.stringify(req.body || {}).length,
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
// API Routes
// ============================================================================

registerHealthRoutes(app, { llmClient, APP_VERSION });

registerAnalysisRoutes(app, {
  llmClient,
  marketAnalyst,
  newsAnalyzer,
  riskManager,
  strategySimulator,
  stockScreener,
  dailyBrain
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
