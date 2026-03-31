import { useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Brain } from 'lucide-react';
import { analyzeMarket } from '../api/client';
import { AnalysisForm } from '../components/form/AnalysisForm';
import { AnalysisResults } from '../components/results/AnalysisResults';
import { ErrorState } from '../components/states/ErrorState';
import { AnalysisLoadingState } from '../components/states/AnalysisLoadingState';
import { saveStockAnalysis } from '../utils/storage';
import { useAnalysis } from '../hooks/useAnalysis';
import type { AnalysisRequest, AnalysisResponse } from '../types';

export function AnalyzePage() {
  const saveFn = useCallback((request: AnalysisRequest, response: AnalysisResponse) => {
    saveStockAnalysis(request, response);
    toast.success(`Analysis for ${request.ticker} saved to history`);
  }, []);

  const { state, submit, reset } = useAnalysis(analyzeMarket, saveFn);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="space-y-6"
      initial={{ opacity: 0 }}
    >
      {/* Form visible during idle, loading, and error states */}
      {state.status !== 'success' && (
        <AnalysisForm isLoading={state.status === 'loading'} onSubmit={submit} />
      )}

      {/* AI processing indicator with estimated wait time */}
      {state.status === 'loading' && (
        <AnalysisLoadingState
          icon={Brain}
          title="Analyzing..."
          subtitle="Reasoning with AI — this may take 8–15 seconds. Evaluating business model, financial health, competitive position, and risks."
        />
      )}

      {/* User-friendly error with retry option */}
      {state.status === 'error' && <ErrorState message={state.message} onRetry={reset} />}

      {/* Structured AI response rendered in organized cards */}
      {state.status === 'success' && (
        <AnalysisResults onNewAnalysis={reset} response={state.response} />
      )}
    </motion.div>
  );
}
