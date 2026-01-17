/**
 * LocalStorage utilities for MarketMind history persistence
 */

import { AnalysisResponse, NewsAnalysisResponse, RiskProfileResponse, StrategySimulationResponse, StockScreenResponse, DailyRoutineResponse, AnalysisRequest, NewsAnalysisRequest, RiskProfileRequest, StrategySimulationRequest, StockScreenRequest, DailyRoutineRequest } from '../types';

// Storage keys
const HISTORY_KEY = 'marketmind-history';
const DARK_MODE_KEY = 'marketmind-dark-mode';
const MAX_HISTORY_ITEMS = 50;

// History item types
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

/**
 * Generate a simple UUID v4
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get all history items from localStorage
 */
export function getHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as HistoryItem[];
  } catch {
    console.error('Failed to parse history from localStorage');
    return [];
  }
}

/**
 * Save a stock analysis to history
 */
export function saveStockAnalysis(input: AnalysisRequest, output: AnalysisResponse): HistoryItem {
  const item: StockHistoryItem = {
    id: generateId(),
    type: 'stock',
    input,
    output,
    timestamp: new Date().toISOString()
  };
  
  addToHistory(item);
  return item;
}

/**
 * Save a news analysis to history
 */
export function saveNewsAnalysis(input: NewsAnalysisRequest, output: NewsAnalysisResponse): HistoryItem {
  const item: NewsHistoryItem = {
    id: generateId(),
    type: 'news',
    input,
    output,
    timestamp: new Date().toISOString()
  };
  
  addToHistory(item);
  return item;
}

/**
 * Save a risk analysis to history
 */
export function saveRiskAnalysis(input: RiskProfileRequest, output: RiskProfileResponse): HistoryItem {
  const item: RiskHistoryItem = {
    id: generateId(),
    type: 'risk',
    input,
    output,
    timestamp: new Date().toISOString()
  };
  
  addToHistory(item);
  return item;
}

/**
 * Save a strategy simulation to history
 */
export function saveStrategySimulation(input: StrategySimulationRequest, output: StrategySimulationResponse): HistoryItem {
  const item: StrategyHistoryItem = {
    id: generateId(),
    type: 'strategy',
    input,
    output,
    timestamp: new Date().toISOString()
  };
  
  addToHistory(item);
  return item;
}

/**
 * Save a stock screening to history
 */
export function saveScreenerResult(input: StockScreenRequest, output: StockScreenResponse): HistoryItem {
  const item: ScreenerHistoryItem = {
    id: generateId(),
    type: 'screener',
    input,
    output,
    timestamp: new Date().toISOString()
  };
  
  addToHistory(item);
  return item;
}

/**
 * Save a daily routine to history
 */
export function saveDailyResult(input: DailyRoutineRequest, output: DailyRoutineResponse): HistoryItem {
  const item: DailyHistoryItem = {
    id: generateId(),
    type: 'daily',
    input,
    output,
    timestamp: new Date().toISOString()
  };
  
  addToHistory(item);
  return item;
}

/**
 * Add an item to history, pruning oldest if exceeds max
 */
function addToHistory(item: HistoryItem): void {
  const history = getHistory();
  
  // Add new item at the beginning
  history.unshift(item);
  
  // Prune if exceeds max
  if (history.length > MAX_HISTORY_ITEMS) {
    history.splice(MAX_HISTORY_ITEMS);
  }
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history to localStorage', e);
  }
}

/**
 * Clear all history
 */
export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

/**
 * Delete a specific history item
 */
export function deleteHistoryItem(id: string): void {
  const history = getHistory().filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/**
 * Get dark mode preference
 */
export function getDarkMode(): boolean {
  const stored = localStorage.getItem(DARK_MODE_KEY);
  if (stored === null) {
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return stored === 'true';
}

/**
 * Set dark mode preference
 */
export function setDarkMode(enabled: boolean): void {
  localStorage.setItem(DARK_MODE_KEY, String(enabled));
}
