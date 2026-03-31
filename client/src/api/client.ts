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

async function apiPost<Req, Res>(path: string, request: Req, errorLabel: string): Promise<Res> {
  try {
    const response = await client.post<Res>(path, request);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const apiError = error.response.data as ApiError;
      throw new AnalysisError(
        apiError.message || `${errorLabel} failed`,
        error.response.status,
        apiError
      );
    }
    throw new AnalysisError('Network error - please check your connection', 0);
  }
}

export function analyzeMarket(request: AnalysisRequest): Promise<AnalysisResponse> {
  return apiPost('/analyze', request, 'Analysis');
}

export function analyzeNews(request: NewsAnalysisRequest): Promise<NewsAnalysisResponse> {
  return apiPost('/analyze-news', request, 'News analysis');
}

export function analyzeRisk(request: RiskProfileRequest): Promise<RiskProfileResponse> {
  return apiPost('/analyze-risk', request, 'Risk analysis');
}

export function simulateStrategy(request: StrategySimulationRequest): Promise<StrategySimulationResponse> {
  return apiPost('/simulate-strategy', request, 'Strategy simulation');
}

export function screenStock(request: StockScreenRequest): Promise<StockScreenResponse> {
  return apiPost('/screen-stock', request, 'Stock screening');
}

export function generateRoutine(request: DailyRoutineRequest = {}): Promise<DailyRoutineResponse> {
  return apiPost('/generate-routine', request, 'Routine generation');
}

export async function checkHealth(): Promise<{ status: string; llmConfigured: boolean }> {
  const response = await client.get('/health');
  return response.data;
}

export class AnalysisError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly apiError?: ApiError
  ) {
    super(message);
    this.name = 'AnalysisError';
  }

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
