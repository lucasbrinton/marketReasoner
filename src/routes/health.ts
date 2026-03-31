import { Express, Request, Response } from 'express';
import { LLMClient } from '../llm/LLMClient';
import { getLLMProviderStatus } from '../llm/factory';
import { getMockData, getAvailableMockTickers } from '../data/mockData';
import { env } from '../config/env';

export interface HealthRouteConfig {
  llmClient: LLMClient;
  APP_VERSION: string;
}

export function registerHealthRoutes(app: Express, config: HealthRouteConfig): void {
  const { llmClient, APP_VERSION } = config;

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      llmConfigured: llmClient.isConfigured()
    });
  });

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
}
