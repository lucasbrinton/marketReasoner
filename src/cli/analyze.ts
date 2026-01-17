#!/usr/bin/env ts-node
/**
 * MarketMind CLI - Market Analysis Runner
 * 
 * Simple CLI for testing the AI Market Analyst module.
 * 
 * Usage:
 *   npm start                    # Analyze AAPL (default)
 *   npm start -- --ticker MSFT   # Analyze MSFT
 *   npm start -- --list          # List available tickers
 */

import { createLLMClient, getLLMProviderStatus } from '../llm/factory';
import { ReasoningService } from '../services/ReasoningService';
import { MarketAnalyst } from '../services/MarketAnalyst';
import { getMockData, getAvailableMockTickers, MOCK_AAPL } from '../data/mockData';
import { MarketAnalysisInput } from '../schemas/marketAnalysis';
import { logger } from '../utils/logger';

/**
 * Parse command line arguments
 */
function parseArgs(): { ticker?: string; list?: boolean; help?: boolean } {
  const args = process.argv.slice(2);
  const result: { ticker?: string; list?: boolean; help?: boolean } = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--ticker' || arg === '-t') {
      result.ticker = args[i + 1];
      i++;
    } else if (arg === '--list' || arg === '-l') {
      result.list = true;
    } else if (arg === '--help' || arg === '-h') {
      result.help = true;
    }
  }

  return result;
}

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    MarketMind CLI                            ║
║         AI-Powered Market Analysis (Phase 1)                 ║
╚══════════════════════════════════════════════════════════════╝

Usage:
  npm start                     Run analysis with default (AAPL)
  npm start -- --ticker MSFT    Analyze specific ticker
  npm start -- --list           List available mock tickers
  npm start -- --help           Show this help message

Options:
  -t, --ticker <TICKER>   Ticker symbol to analyze
  -l, --list              List available mock data tickers
  -h, --help              Show help message

Available Tickers:
  ${getAvailableMockTickers().join(', ')}

Environment Variables:
  ANTHROPIC_API_KEY       Required. Your Anthropic API key.
  CLAUDE_MODEL            Optional. Claude model to use.
  LOG_LEVEL               Optional. Logging level (debug/info/warn/error).

Example:
  ANTHROPIC_API_KEY=sk-xxx npm start -- --ticker NVDA
`);
}

/**
 * Print analysis result in a formatted way
 */
function printAnalysisResult(
  input: MarketAnalysisInput,
  result: Awaited<ReturnType<MarketAnalyst['analyzeMarket']>>
): void {
  console.log('\n' + '═'.repeat(70));
  console.log(`  MARKET ANALYSIS: ${input.ticker}`);
  console.log(`  Horizon: ${input.horizon} | Style: ${input.style}`);
  console.log('═'.repeat(70) + '\n');

  if (!result.success) {
    console.log('❌ ANALYSIS FAILED\n');
    console.log(`Error: ${result.error.message}`);
    if (result.error.details) {
      console.log(`Attempts: ${result.error.details.attempts}`);
      if (result.error.details.lastError) {
        console.log(`Last Error: ${result.error.details.lastError}`);
      }
    }
    return;
  }

  const { data } = result;

  // Business Model
  console.log('📊 BUSINESS MODEL');
  console.log('─'.repeat(50));
  console.log(data.business_model);
  console.log('');

  // Financial Health
  console.log('💰 FINANCIAL HEALTH');
  console.log('─'.repeat(50));
  console.log(`Summary: ${data.financial_health.summary}`);
  console.log('\nStrengths:');
  data.financial_health.strengths.forEach((s) => console.log(`  ✅ ${s}`));
  console.log('\nWeaknesses:');
  data.financial_health.weaknesses.forEach((w) => console.log(`  ⚠️  ${w}`));
  console.log('');

  // Competitive Edge
  console.log('🏰 COMPETITIVE EDGE');
  console.log('─'.repeat(50));
  const moatEmoji = data.competitive_edge.moat === 'strong' ? '🟢' :
                    data.competitive_edge.moat === 'moderate' ? '🟡' : '🔴';
  console.log(`Moat: ${moatEmoji} ${data.competitive_edge.moat.toUpperCase()}`);
  console.log(`Explanation: ${data.competitive_edge.explanation}`);
  console.log('');

  // Risks
  console.log('⚠️  RISK ASSESSMENT');
  console.log('─'.repeat(50));
  console.log('\nShort-Term Risks (0-12 months):');
  data.risks.short_term.forEach((r) => console.log(`  • ${r}`));
  console.log('\nLong-Term Risks (12+ months):');
  data.risks.long_term.forEach((r) => console.log(`  • ${r}`));
  console.log('\nUnknowns & Uncertainties:');
  data.risks.unknowns.forEach((u) => console.log(`  ❓ ${u}`));
  console.log('');

  // Confidence Level
  const confidenceEmoji = data.confidence_level === 'high' ? '🟢' :
                          data.confidence_level === 'medium' ? '🟡' : '🔴';
  console.log('📈 ANALYSIS CONFIDENCE');
  console.log('─'.repeat(50));
  console.log(`${confidenceEmoji} ${data.confidence_level.toUpperCase()}`);
  console.log('');

  console.log('═'.repeat(70));
  console.log('  ⚠️  DISCLAIMER: This is NOT investment advice. No buy/sell signals.');
  console.log('  This analysis is for educational and research purposes only.');
  console.log('═'.repeat(70) + '\n');
}

/**
 * Main CLI entry point
 */
async function main(): Promise<void> {
  const args = parseArgs();

  // Handle help
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  // Handle list
  if (args.list) {
    console.log('\nAvailable mock tickers:');
    getAvailableMockTickers().forEach((ticker) => {
      const data = getMockData(ticker);
      if (data) {
        console.log(`  ${ticker}: ${data.financialData.sector} | Horizon: ${data.horizon} | Style: ${data.style}`);
      }
    });
    console.log('');
    process.exit(0);
  }

  // Get input data
  const ticker = args.ticker ?? 'AAPL';
  const input = getMockData(ticker);

  if (!input) {
    console.error(`\n❌ Unknown ticker: ${ticker}`);
    console.error(`Available tickers: ${getAvailableMockTickers().join(', ')}\n`);
    process.exit(1);
  }

  console.log(`\n🔍 Starting MarketMind analysis for ${ticker}...\n`);

  // Check for API key (prefer Gemini, fallback to Claude)
  const providerStatus = getLLMProviderStatus();
  if (providerStatus.configured.length === 0) {
    console.error('❌ Error: No LLM API key configured.');
    console.error('Please set GOOGLE_API_KEY (preferred, free) or ANTHROPIC_API_KEY.');
    console.error('\nExample:');
    console.error('  GOOGLE_API_KEY=xxx npm start');
    console.error('  ANTHROPIC_API_KEY=sk-xxx npm start\n');
    process.exit(1);
  }

  console.log(`🤖 Using ${providerStatus.active?.toUpperCase()} as LLM provider\n`);

  // Initialize services
  const llmClient = createLLMClient();
  const reasoningService = new ReasoningService(llmClient, {
    maxRetries: 3,
    baseDelayMs: 1000
  });
  const marketAnalyst = new MarketAnalyst(reasoningService);

  // Run analysis
  try {
    const startTime = Date.now();
    const result = await marketAnalyst.analyzeMarket(input);
    const duration = Date.now() - startTime;

    // Print result
    printAnalysisResult(input, result);

    // Print timing
    console.log(`⏱️  Analysis completed in ${(duration / 1000).toFixed(2)}s\n`);

    process.exit(result.success ? 0 : 1);
  } catch (error) {
    logger.error('Unexpected error during analysis', { error });
    console.error('\n❌ Unexpected error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run CLI
main();
