/**
 * Mock Financial Data
 * 
 * Hardcoded financial data for testing purposes.
 * In production, this would be replaced with real data sources.
 */

import { MarketAnalysisInput } from '../schemas/marketAnalysis';

/**
 * Mock data for AAPL (Apple Inc.)
 */
export const MOCK_AAPL: MarketAnalysisInput = {
  ticker: 'AAPL',
  horizon: 'long',
  style: 'growth',
  financialData: {
    revenue_growth: '12%',
    debt_equity: '0.8',
    free_cash_flow_margin: '18%',
    sector: 'Technology',
    market_cap: '$2.8T',
    pe_ratio: '28.5',
    profit_margin: '25%'
  }
};

/**
 * Mock data for MSFT (Microsoft Corporation)
 */
export const MOCK_MSFT: MarketAnalysisInput = {
  ticker: 'MSFT',
  horizon: 'medium',
  style: 'quality',
  financialData: {
    revenue_growth: '15%',
    debt_equity: '0.4',
    free_cash_flow_margin: '32%',
    sector: 'Technology',
    market_cap: '$3.1T',
    pe_ratio: '35.2',
    profit_margin: '36%'
  }
};

/**
 * Mock data for JPM (JPMorgan Chase)
 */
export const MOCK_JPM: MarketAnalysisInput = {
  ticker: 'JPM',
  horizon: 'medium',
  style: 'value',
  financialData: {
    revenue_growth: '8%',
    debt_equity: '1.2',
    free_cash_flow_margin: '15%',
    sector: 'Financials',
    market_cap: '$580B',
    pe_ratio: '11.5',
    profit_margin: '28%'
  }
};

/**
 * Mock data for NVDA (NVIDIA Corporation)
 */
export const MOCK_NVDA: MarketAnalysisInput = {
  ticker: 'NVDA',
  horizon: 'short',
  style: 'growth',
  financialData: {
    revenue_growth: '122%',
    debt_equity: '0.4',
    free_cash_flow_margin: '45%',
    sector: 'Technology',
    market_cap: '$3.2T',
    pe_ratio: '65.0',
    profit_margin: '55%'
  }
};

/**
 * Mock data for a company with weaker fundamentals
 */
export const MOCK_WEAK_COMPANY: MarketAnalysisInput = {
  ticker: 'WEAK',
  horizon: 'short',
  style: 'value',
  financialData: {
    revenue_growth: '-5%',
    debt_equity: '2.5',
    free_cash_flow_margin: '-3%',
    sector: 'Retail',
    market_cap: '$5B',
    pe_ratio: 'N/A (negative earnings)',
    profit_margin: '-2%'
  }
};

/**
 * Get mock data by ticker
 */
export function getMockData(ticker: string): MarketAnalysisInput | undefined {
  const mocks: Record<string, MarketAnalysisInput> = {
    'AAPL': MOCK_AAPL,
    'MSFT': MOCK_MSFT,
    'JPM': MOCK_JPM,
    'NVDA': MOCK_NVDA,
    'WEAK': MOCK_WEAK_COMPANY
  };

  return mocks[ticker.toUpperCase()];
}

/**
 * Get all available mock tickers
 */
export function getAvailableMockTickers(): string[] {
  return ['AAPL', 'MSFT', 'JPM', 'NVDA', 'WEAK'];
}
