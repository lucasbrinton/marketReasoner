import { ReasoningService } from './ReasoningService';
import {
  RiskProfile,
  RiskProfileInput,
  RiskProfileInputSchema,
  RiskProfileSchema,
  RiskProfileResult
} from '../schemas/riskProfile';
import { buildRiskProfilePrompt } from '../prompts/riskManagerPrompts';
import { logger } from '../utils/logger';

export class RiskManager {
  private readonly reasoningService: ReasoningService;
  private readonly moduleName = 'RiskManager';

  constructor(reasoningService: ReasoningService) {
    this.reasoningService = reasoningService;
  }

  async analyzeRisk(input: RiskProfileInput): Promise<RiskProfileResult> {
    logger.info('Starting risk profile generation', {
      age: input.age,
      drawdownTolerance: input.drawdownTolerance,
      capitalStability: input.capitalStability
    });

    // Validate input
    const inputValidation = RiskProfileInputSchema.safeParse(input);
    if (!inputValidation.success) {
      const errors = inputValidation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      logger.error('Invalid input for risk profile', { errors });
      
      return {
        success: false,
        error: {
          error: 'insufficient_data',
          message: `Invalid input: ${errors.join('; ')}`,
          details: { attempts: 0, lastError: 'Input validation failed' }
        }
      };
    }

    // Build the task prompt
    const taskPrompt = buildRiskProfilePrompt(input);

    // Execute reasoning
    const result = await this.reasoningService.reason<RiskProfile>(
      taskPrompt,
      RiskProfileSchema,
      {
        module: this.moduleName,
        inputData: input
      }
    );

    if (result.success) {
      logger.info('Risk profile generation completed successfully', {
        age: input.age,
        confidence: result.data.confidence_level,
        riskLimitsCount: result.data.risk_limits.length,
        attempts: result.metadata.attempts,
        durationMs: result.metadata.totalDurationMs
      });

      return {
        success: true,
        data: result.data
      };
    } else {
      logger.warn('Risk profile generation failed', {
        age: input.age,
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
