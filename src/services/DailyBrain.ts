/**
 * Daily Brain Service
 * 
 * Generates daily market routines using AI reasoning.
 * Sixth AI-powered module in MarketMind.
 */

import { ReasoningService } from './ReasoningService';
import { 
  DailyRoutineInput, 
  DailyRoutineInputSchema,
  DailyRoutineResult,
  DailyRoutineResultSchema, 
  DailyRoutineServiceResult 
} from '../schemas/dailyRoutine';
import { buildDailyBrainPrompt } from '../prompts/dailyBrainPrompts';
import { logger } from '../utils/logger';

export class DailyBrain {
  private readonly reasoningService: ReasoningService;
  private readonly moduleName = 'DailyBrain';

  constructor(reasoningService: ReasoningService) {
    this.reasoningService = reasoningService;
  }

  async generateRoutine(input: DailyRoutineInput = {}): Promise<DailyRoutineServiceResult> {
    logger.info('Starting routine generation', {
      preferences: input.preferences || '(none)'
    });

    // Validate input
    const inputValidation = DailyRoutineInputSchema.safeParse(input);
    if (!inputValidation.success) {
      const errors = inputValidation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      logger.error('Invalid input for routine generation', { errors });
      
      return {
        success: false,
        error: {
          error: 'insufficient_data',
          message: `Invalid input: ${errors.join('; ')}`,
          details: { attempts: 0, lastError: 'Input validation failed' }
        }
      };
    }

    const validatedInput = inputValidation.data;
    
    // Build prompt
    const taskPrompt = buildDailyBrainPrompt({
      preferences: validatedInput.preferences || ''
    });
    
    // Execute reasoning
    const result = await this.reasoningService.reason<DailyRoutineResult>(
      taskPrompt,
      DailyRoutineResultSchema,
      {
        module: this.moduleName,
        inputData: validatedInput
      }
    );

    if (result.success) {
      const stepCount = Object.values(result.data.routine_steps).filter(Boolean).length;

      logger.info('Routine generation completed successfully', {
        stepCount,
        timeAllocation: result.data.time_allocation,
        confidence: result.data.confidence_level,
        attempts: result.metadata.attempts,
        durationMs: result.metadata.totalDurationMs
      });

      return {
        success: true,
        data: result.data,
        model: result.metadata.model || 'claude-sonnet-4-20250514'
      };
    } else {
      logger.warn('Routine generation failed', {
        error: result.error.message,
        attempts: result.metadata.attempts
      });

      return {
        success: false,
        error: result.error
      };
    }
  }
}
