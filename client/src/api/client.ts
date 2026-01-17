/**
 * API Client for MarketMind Backend
 *
 * @module api/client
 * @description
 * Type-safe HTTP client for communicating with the MarketMind Express API.
 * Handles all AI-powered analysis endpoints with proper error handling.
 *
 * ## Architecture
 * - Uses Axios for HTTP requests with 60s timeout (AI operations are slow)
 * - All responses are strongly typed with TypeScript interfaces
 * - Custom AnalysisError class provides user-friendly error messages
 *
 * ## AI Response Flow
 * 1. Frontend sends typed request to API endpoint
 * 2. Backend validates input with Zod schemas
 * 3. Backend calls Claude AI with structured prompts
 * 4. AI response parsed and validated against output schema
 * 5. Typed response returned to frontend for rendering
 *
 * ## Error Handling
 * - Network errors caught and wrapped in AnalysisError
 * - API errors include status codes and actionable messages
 * - Timeout handling for slow AI responses
 *
 * @example
 * // Making an AI analysis request
 * try {
 *   const response = await analyzeMarket({
 *     ticker: 'AAPL',
 *     horizon: 'long',
 *     style: 'growth'
 *   });
 *   // response.data contains structured AI analysis
 * } catch (error) {
 *   if (error instanceof AnalysisError) {
 *     console.error(error.getUserMessage());
 *   }
 * }
 */

import axios, { AxiosError } from 'axios';
import type {
  AnalysisRequest,
  AnalysisResponse,
  ApiError,
  DailyRoutineRequest,
  DailyRoutineResponse,
  NewsAnalysisRequest,
  NewsAnalysisResponse,
  RiskProfileRequest,
  RiskProfileResponse,
  StockScreenRequest,
  StockScreenResponse,
  StrategySimulationRequest,
  StrategySimulationResponse,
} from '../types';

// API base URL - uses Vite proxy in dev
const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000 // 60s timeout for AI calls
});

/**
 * Run market analysis
 */
export async function analyzeMarket(request: AnalysisRequest): Promise<AnalysisResponse> {
  try {
    const response = await client.post<AnalysisResponse>('/analyze', request);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const apiError = error.response.data as ApiError;
      throw new AnalysisError(
        apiError.message || 'Analysis failed',
        error.response.status,
        apiError
      );
    }
    throw new AnalysisError('Network error - please check your connection', 0);
  }
}

/**
 * Run news impact analysis
 */
export async function analyzeNews(request: NewsAnalysisRequest): Promise<NewsAnalysisResponse> {
  try {
    const response = await client.post<NewsAnalysisResponse>('/analyze-news', request);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const apiError = error.response.data as ApiError;
      throw new AnalysisError(
        apiError.message || 'News analysis failed',
        error.response.status,
        apiError
      );
    }
    throw new AnalysisError('Network error - please check your connection', 0);
  }
}

/**
 * Run risk profile analysis
 */
export async function analyzeRisk(request: RiskProfileRequest): Promise<RiskProfileResponse> {
  try {
    const response = await client.post<RiskProfileResponse>('/analyze-risk', request);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const apiError = error.response.data as ApiError;
      throw new AnalysisError(
        apiError.message || 'Risk analysis failed',
        error.response.status,
        apiError
      );
    }
    throw new AnalysisError('Network error - please check your connection', 0);
  }
}

/**
 * Run strategy simulation
 */
export async function simulateStrategy(request: StrategySimulationRequest): Promise<StrategySimulationResponse> {
  try {
    const response = await client.post<StrategySimulationResponse>('/simulate-strategy', request);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const apiError = error.response.data as ApiError;
      throw new AnalysisError(
        apiError.message || 'Strategy simulation failed',
        error.response.status,
        apiError
      );
    }
    throw new AnalysisError('Network error - please check your connection', 0);
  }
}

/**
 * Run stock screening
 */
export async function screenStock(request: StockScreenRequest): Promise<StockScreenResponse> {
  try {
    const response = await client.post<StockScreenResponse>('/screen-stock', request);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const apiError = error.response.data as ApiError;
      throw new AnalysisError(
        apiError.message || 'Stock screening failed',
        error.response.status,
        apiError
      );
    }
    throw new AnalysisError('Network error - please check your connection', 0);
  }
}

/**
 * Generate daily market routine
 */
export async function generateRoutine(request: DailyRoutineRequest = {}): Promise<DailyRoutineResponse> {
  try {
    const response = await client.post<DailyRoutineResponse>('/generate-routine', request);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const apiError = error.response.data as ApiError;
      throw new AnalysisError(
        apiError.message || 'Routine generation failed',
        error.response.status,
        apiError
      );
    }
    throw new AnalysisError('Network error - please check your connection', 0);
  }
}

/**
 * Check API health status
 * @returns Health status and LLM configuration state
 */
export async function checkHealth(): Promise<{ status: string; llmConfigured: boolean }> {
  const response = await client.get('/health');
  return response.data;
}

/**
 * Custom error class for API/AI failures
 *
 * Provides structured error handling with user-friendly messages
 * based on HTTP status codes and backend error responses.
 *
 * @example
 * try {
 *   await analyzeMarket(request);
 * } catch (error) {
 *   if (error instanceof AnalysisError) {
 *     // Show user-friendly message
 *     toast.error(error.getUserMessage());
 *   }
 * }
 */
export class AnalysisError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly apiError?: ApiError
  ) {
    super(message);
    this.name = 'AnalysisError';
  }

  /**
   * Get user-friendly error message based on HTTP status and error type.
   * Maps technical errors to actionable messages for end users.
   *
   * @returns User-friendly error message string
   */
  getUserMessage(): string {
    if (this.status === 400) {
      if (this.apiError?.error === 'unknown_ticker') {
        return `Unknown ticker. Available: ${this.apiError.availableTickers?.join(', ')}`;
      }
      return 'Invalid input - please check your selections';
    }
    if (this.status === 503) {
      return 'AI service unavailable - API key may not be configured';
    }
    if (this.status === 500) {
      return 'Analysis failed - please try again or choose a different ticker';
    }
    if (this.status === 0) {
      return 'Cannot connect to server - please ensure the backend is running';
    }
    return this.message;
  }
}
