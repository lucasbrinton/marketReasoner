/**
 * Logger Utility
 * 
 * Centralized logging for all MarketMind operations.
 * Uses Winston for structured logging with multiple transports.
 */

import winston from 'winston';
import path from 'path';

const LOG_LEVEL = process.env['LOG_LEVEL'] ?? 'info';
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';
const LOG_TO_FILE = process.env['LOG_TO_FILE'] === 'true';

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level.toUpperCase()}] ${message}`;
    
    const metaKeys = Object.keys(metadata);
    if (metaKeys.length > 0 && !metadata['stack']) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    if (metadata['stack']) {
      msg += `\n${metadata['stack']}`;
    }
    
    return msg;
  })
);

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Configure transports
const transports: winston.transport[] = [
  new winston.transports.Console()
];

// Add file transport in production or when explicitly enabled
if (NODE_ENV === 'production' || LOG_TO_FILE) {
  const logsDir = path.join(process.cwd(), 'logs');
  
  transports.push(
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
}

export const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: NODE_ENV === 'production' ? jsonFormat : customFormat,
  transports
});

/**
 * Create a child logger with additional context
 */
export function createChildLogger(context: Record<string, unknown>): winston.Logger {
  return logger.child(context);
}

/**
 * Log an AI request/response pair for auditing
 */
export function logAIInteraction(data: {
  module: string;
  request: {
    prompt: string;
    data: unknown;
  };
  response?: {
    raw: string;
    parsed?: unknown;
    validationError?: string;
  };
  durationMs: number;
  success: boolean;
  retryCount?: number;
}): void {
  const logLevel = data.success ? 'info' : 'warn';
  
  logger.log(logLevel, 'AI Interaction', {
    module: data.module,
    durationMs: data.durationMs,
    success: data.success,
    retryCount: data.retryCount ?? 0,
    requestDataKeys: Object.keys(data.request.data as object),
    responseLength: data.response?.raw?.length ?? 0,
    validationError: data.response?.validationError
  });

  // Log full details at debug level
  logger.debug('AI Interaction Details', {
    ...data
  });
}
