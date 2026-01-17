/**
 * LLM Client Factory
 * 
 * Creates the appropriate LLM client based on environment configuration.
 * Prefers Claude (Anthropic) as the primary provider.
 */

import { LLMClient } from './LLMClient';
import { ClaudeClient } from './ClaudeClient';
import { logger } from '../utils/logger';

/**
 * Create the preferred LLM client based on available API keys.
 * 
 * Priority:
 * 1. ClaudeClient (if ANTHROPIC_API_KEY is set)
 * 
 * @returns Configured LLM client
 */
export function createLLMClient(): LLMClient {
  const claudeClient = new ClaudeClient();
  if (claudeClient.isConfigured()) {
    logger.info('Using Claude (Anthropic) as LLM provider');
    return claudeClient;
  }

  // Return unconfigured Claude client (will error on use)
  logger.warn('No LLM provider configured. Set ANTHROPIC_API_KEY.');
  return claudeClient;
}

/**
 * Get information about available LLM providers
 */
export function getLLMProviderStatus(): {
  preferred: string;
  configured: string[];
  active: string | null;
} {
  const claudeClient = new ClaudeClient();

  const configured: string[] = [];
  if (claudeClient.isConfigured()) configured.push('claude');

  const active = claudeClient.isConfigured() ? 'claude' : null;

  return {
    preferred: 'claude',
    configured,
    active
  };
}
