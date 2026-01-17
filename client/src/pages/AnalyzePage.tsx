/**
 * AnalyzePage - Stock Market Analysis Module
 *
 * @module pages/AnalyzePage
 * @description
 * Primary page for AI-powered stock analysis. This component demonstrates
 * sophisticated state management for handling async AI operations.
 *
 * ## Architecture
 * Uses a discriminated union pattern for page state, ensuring type-safe
 * transitions between idle → loading → success/error states.
 *
 * ## AI Integration Flow
 * 1. User submits form with ticker, horizon, and investment style
 * 2. Request sent to backend via API client with 60s timeout
 * 3. Backend calls Claude AI for structured market analysis
 * 4. Response validated against Zod schema before rendering
 * 5. Results persisted to localStorage for history tracking
 *
 * ## Error Handling
 * - Network errors: User-friendly connectivity message
 * - API errors: Parsed from backend response with actionable details
 * - Timeout: AI operations may take 8-15 seconds
 *
 * @example
 * // Page state types ensure exhaustive handling
 * type PageState =
 *   | { status: 'idle' }
 *   | { status: 'loading'; ticker: string }
 *   | { status: 'success'; response: AnalysisResponse }
 *   | { status: 'error'; message: string }
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { AnalysisError, analyzeMarket } from '../api/client';
import { AnalysisForm } from '../components/form/AnalysisForm';
import { AnalysisResults } from '../components/results/AnalysisResults';
import { ErrorState } from '../components/states/ErrorState';
import { LoadingState } from '../components/states/LoadingState';
import { saveStockAnalysis } from '../utils/storage';
import type { AnalysisRequest, AnalysisResponse } from '../types';

/**
 * Discriminated union for page state management.
 * Enables exhaustive type checking in render logic.
 */
type PageState =
  | { status: 'idle' }
  | { status: 'loading'; ticker: string; request: AnalysisRequest }
  | { status: 'success'; response: AnalysisResponse; request: AnalysisRequest }
  | { status: 'error'; message: string };

/**
 * Stock Market Analysis Page Component
 *
 * @returns JSX.Element - The analysis page with form, loading, error, and results states
 */
export function AnalyzePage() {
  const [state, setState] = useState<PageState>({ status: 'idle' });

  /**
   * Handles form submission and AI analysis request.
   * Manages the full async lifecycle including loading states and error handling.
   */
  const handleSubmit = async (data: AnalysisRequest) => {
    setState({ status: 'loading', ticker: data.ticker, request: data });

    try {
      const response = await analyzeMarket(data);
      setState({ status: 'success', response, request: data });

      // Persist to localStorage for history feature
      saveStockAnalysis(data, response);
      toast.success(`Analysis for ${data.ticker} saved to history`);
    } catch (error) {
      if (error instanceof AnalysisError) {
        toast.error(error.getUserMessage());
        setState({ status: 'error', message: error.getUserMessage() });
      } else {
        toast.error('An unexpected error occurred');
        setState({
          status: 'error',
          message: 'An unexpected error occurred. Please try again.',
        });
      }
    }
  };

  /** Resets page to initial idle state for new analysis */
  const handleReset = () => {
    setState({ status: 'idle' });
  };

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="space-y-6"
      initial={{ opacity: 0 }}
    >
      {/* Form visible during idle, loading, and error states */}
      {state.status !== 'success' && (
        <AnalysisForm isLoading={state.status === 'loading'} onSubmit={handleSubmit} />
      )}

      {/* AI processing indicator with estimated wait time */}
      {state.status === 'loading' && <LoadingState ticker={state.ticker} />}

      {/* User-friendly error with retry option */}
      {state.status === 'error' && <ErrorState message={state.message} onRetry={handleReset} />}

      {/* Structured AI response rendered in organized cards */}
      {state.status === 'success' && (
        <AnalysisResults onNewAnalysis={handleReset} response={state.response} />
      )}
    </motion.div>
  );
}
