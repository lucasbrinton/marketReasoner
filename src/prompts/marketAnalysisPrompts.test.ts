/**
 * Market Analysis Prompts Tests
 */

import { buildMarketAnalysisPrompt, buildRetryPrompt } from '../prompts/marketAnalysisPrompts';
import { MarketAnalysisInput } from '../schemas/marketAnalysis';
import { MOCK_AAPL, MOCK_JPM } from '../data/mockData';

describe('buildMarketAnalysisPrompt', () => {
  it('should include ticker in prompt', () => {
    const prompt = buildMarketAnalysisPrompt(MOCK_AAPL);
    expect(prompt).toContain('AAPL');
  });

  it('should include horizon description', () => {
    const prompt = buildMarketAnalysisPrompt(MOCK_AAPL);
    expect(prompt).toContain('long');
    expect(prompt).toContain('18+ months');
  });

  it('should include style focus', () => {
    const prompt = buildMarketAnalysisPrompt(MOCK_AAPL);
    expect(prompt).toContain('growth');
    expect(prompt).toContain('revenue expansion');
  });

  it('should include financial data', () => {
    const prompt = buildMarketAnalysisPrompt(MOCK_AAPL);
    expect(prompt).toContain('12%');
    expect(prompt).toContain('0.8');
    expect(prompt).toContain('18%');
    expect(prompt).toContain('Technology');
  });

  it('should include optional data when present', () => {
    const prompt = buildMarketAnalysisPrompt(MOCK_AAPL);
    expect(prompt).toContain('$2.8T');
    expect(prompt).toContain('28.5');
    expect(prompt).toContain('25%');
  });

  it('should include output schema description', () => {
    const prompt = buildMarketAnalysisPrompt(MOCK_AAPL);
    expect(prompt).toContain('business_model');
    expect(prompt).toContain('financial_health');
    expect(prompt).toContain('competitive_edge');
    expect(prompt).toContain('risks');
    expect(prompt).toContain('confidence_level');
  });

  it('should include instructions for no buy/sell', () => {
    const prompt = buildMarketAnalysisPrompt(MOCK_AAPL);
    expect(prompt).toContain('NO buy/sell/hold');
    expect(prompt).toContain('NO price targets');
  });

  it('should handle different sectors', () => {
    const prompt = buildMarketAnalysisPrompt(MOCK_JPM);
    expect(prompt).toContain('JPM');
    expect(prompt).toContain('Financials');
    expect(prompt).toContain('value');
  });

  it('should describe all horizon types correctly', () => {
    const shortInput: MarketAnalysisInput = { ...MOCK_AAPL, horizon: 'short' };
    const mediumInput: MarketAnalysisInput = { ...MOCK_AAPL, horizon: 'medium' };
    const longInput: MarketAnalysisInput = { ...MOCK_AAPL, horizon: 'long' };

    expect(buildMarketAnalysisPrompt(shortInput)).toContain('0-6 months');
    expect(buildMarketAnalysisPrompt(mediumInput)).toContain('6-18 months');
    expect(buildMarketAnalysisPrompt(longInput)).toContain('18+ months');
  });

  it('should describe all style types correctly', () => {
    const growthInput: MarketAnalysisInput = { ...MOCK_AAPL, style: 'growth' };
    const valueInput: MarketAnalysisInput = { ...MOCK_AAPL, style: 'value' };
    const qualityInput: MarketAnalysisInput = { ...MOCK_AAPL, style: 'quality' };

    expect(buildMarketAnalysisPrompt(growthInput)).toContain('revenue expansion');
    expect(buildMarketAnalysisPrompt(valueInput)).toContain('undervaluation');
    expect(buildMarketAnalysisPrompt(qualityInput)).toContain('business durability');
  });
});

describe('buildRetryPrompt', () => {
  const originalPrompt = 'Original task prompt';
  const previousOutput = '{"invalid": "response"}';
  const errors = ['Missing required field: business_model'];

  it('should include original prompt', () => {
    const retryPrompt = buildRetryPrompt(originalPrompt, previousOutput, errors);
    expect(retryPrompt).toContain(originalPrompt);
  });

  it('should include previous output', () => {
    const retryPrompt = buildRetryPrompt(originalPrompt, previousOutput, errors);
    expect(retryPrompt).toContain(previousOutput);
  });

  it('should include validation errors', () => {
    const retryPrompt = buildRetryPrompt(originalPrompt, previousOutput, errors);
    expect(retryPrompt).toContain('business_model');
  });

  it('should include multiple errors', () => {
    const multipleErrors = ['Error 1', 'Error 2', 'Error 3'];
    const retryPrompt = buildRetryPrompt(originalPrompt, previousOutput, multipleErrors);
    
    expect(retryPrompt).toContain('Error 1');
    expect(retryPrompt).toContain('Error 2');
    expect(retryPrompt).toContain('Error 3');
  });

  it('should instruct for JSON-only output', () => {
    const retryPrompt = buildRetryPrompt(originalPrompt, previousOutput, errors);
    expect(retryPrompt).toContain('ONLY valid JSON');
  });
});
