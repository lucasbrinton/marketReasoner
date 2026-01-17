/**
 * Environment Configuration
 * 
 * Validates and exports environment variables with type safety.
 */

import { z } from 'zod';
import 'dotenv/config';

// Environment schema
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('4000'),
  
  // API Keys
  ANTHROPIC_API_KEY: z.string().optional(),
  
  // Frontend
  FRONTEND_ORIGIN: z.string().default('http://localhost:5173'),
  
  // Rate Limiting (production)
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('60000'), // 1 minute
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('30'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_TO_FILE: z.string().transform(v => v === 'true').default('false')
});

// Parse and validate
function validateEnv() {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error('❌ Invalid environment configuration:');
    result.error.issues.forEach(issue => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
  }
  
  return result.data;
}

export const env = validateEnv();

// Derived values
export const isProd = env.NODE_ENV === 'production';
export const isDev = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

// Validate critical keys in production
if (isProd && !env.ANTHROPIC_API_KEY) {
  console.warn('⚠️ Warning: ANTHROPIC_API_KEY not set in production');
}

export type Env = z.infer<typeof envSchema>;
