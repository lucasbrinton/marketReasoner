import { LLMClient } from './LLMClient';
import { ClaudeClient } from './ClaudeClient';
import { logger } from '../utils/logger';

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
