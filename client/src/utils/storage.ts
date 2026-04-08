import { AnalysisResponse, NewsAnalysisResponse, RiskProfileResponse, StrategySimulationResponse, StockScreenResponse, DailyRoutineResponse, AnalysisRequest, NewsAnalysisRequest, RiskProfileRequest, StrategySimulationRequest, StockScreenRequest, DailyRoutineRequest } from '../types';

const HISTORY_KEY = 'marketmind-history';
const DARK_MODE_KEY = 'marketmind-dark-mode';
const MAX_HISTORY_ITEMS = 50;

export interface StockHistoryItem {
  id: string;
  type: 'stock';
  input: AnalysisRequest;
  output: AnalysisResponse;
  timestamp: string;
}

export interface NewsHistoryItem {
  id: string;
  type: 'news';
  input: NewsAnalysisRequest;
  output: NewsAnalysisResponse;
  timestamp: string;
}

export interface RiskHistoryItem {
  id: string;
  type: 'risk';
  input: RiskProfileRequest;
  output: RiskProfileResponse;
  timestamp: string;
}

export interface StrategyHistoryItem {
  id: string;
  type: 'strategy';
  input: StrategySimulationRequest;
  output: StrategySimulationResponse;
  timestamp: string;
}

export interface ScreenerHistoryItem {
  id: string;
  type: 'screener';
  input: StockScreenRequest;
  output: StockScreenResponse;
  timestamp: string;
}

export interface DailyHistoryItem {
  id: string;
  type: 'daily';
  input: DailyRoutineRequest;
  output: DailyRoutineResponse;
  timestamp: string;
}

export type HistoryItem = StockHistoryItem | NewsHistoryItem | RiskHistoryItem | StrategyHistoryItem | ScreenerHistoryItem | DailyHistoryItem;

export function generateId(): string {
  return crypto.randomUUID();
}

export function getHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as HistoryItem[];
  } catch (error) {
    console.error('[storage] Failed to parse history from localStorage:', error);
    return [];
  }
}

function saveToHistory<TInput, TOutput>(
  type: HistoryItem['type'],
  input: TInput,
  output: TOutput
): HistoryItem {
  const item = {
    id: generateId(),
    type,
    input,
    output,
    timestamp: new Date().toISOString()
  } as HistoryItem;

  addToHistory(item);
  return item;
}

export function saveStockAnalysis(input: AnalysisRequest, output: AnalysisResponse): HistoryItem {
  return saveToHistory('stock', input, output);
}

export function saveNewsAnalysis(input: NewsAnalysisRequest, output: NewsAnalysisResponse): HistoryItem {
  return saveToHistory('news', input, output);
}

export function saveRiskAnalysis(input: RiskProfileRequest, output: RiskProfileResponse): HistoryItem {
  return saveToHistory('risk', input, output);
}

export function saveStrategySimulation(input: StrategySimulationRequest, output: StrategySimulationResponse): HistoryItem {
  return saveToHistory('strategy', input, output);
}

export function saveScreenerResult(input: StockScreenRequest, output: StockScreenResponse): HistoryItem {
  return saveToHistory('screener', input, output);
}

export function saveDailyResult(input: DailyRoutineRequest, output: DailyRoutineResponse): HistoryItem {
  return saveToHistory('daily', input, output);
}

function addToHistory(item: HistoryItem): void {
  const history = getHistory();

  history.unshift(item);

  if (history.length > MAX_HISTORY_ITEMS) {
    history.splice(MAX_HISTORY_ITEMS);
  }

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('[storage] Failed to save history to localStorage:', error);
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('[storage] Failed to clear history:', error);
  }
}

export function deleteHistoryItem(id: string): void {
  try {
    const history = getHistory().filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('[storage] Failed to delete history item:', { id, error });
  }
}

export function getDarkMode(): boolean {
  try {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    if (stored === null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return stored === 'true';
  } catch (error) {
    console.error('[storage] Failed to read dark mode preference:', error);
    return false;
  }
}

export function setDarkMode(enabled: boolean): void {
  try {
    localStorage.setItem(DARK_MODE_KEY, String(enabled));
  } catch (error) {
    console.error('[storage] Failed to save dark mode preference:', error);
  }
}
