import { useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Newspaper } from 'lucide-react';
import { NewsForm } from '../components/form/NewsForm';
import { NewsAnalysisResults } from '../components/news-results/NewsAnalysisResults';
import { AnalysisLoadingState } from '../components/states/AnalysisLoadingState';
import { ErrorState } from '../components/states/ErrorState';
import { analyzeNews } from '../api/client';
import { saveNewsAnalysis } from '../utils/storage';
import { useAnalysis } from '../hooks/useAnalysis';
import type { NewsAnalysisRequest, NewsAnalysisResponse } from '../types';

export function NewsPage() {
  const saveFn = useCallback((request: NewsAnalysisRequest, response: NewsAnalysisResponse) => {
    saveNewsAnalysis(request, response);
    toast.success(`News analysis for ${request.stockOrSector} saved to history`);
  }, []);

  const { state, submit, reset } = useAnalysis(analyzeNews, saveFn);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Always show form unless showing results */}
      {state.status !== 'success' && (
        <NewsForm
          onSubmit={submit}
          isLoading={state.status === 'loading'}
        />
      )}

      {/* Loading state */}
      {state.status === 'loading' && (
        <AnalysisLoadingState
          icon={Newspaper}
          title="Analyzing news..."
          subtitle="Reasoning with AI — this may take 8–15 seconds. Evaluating market reaction, business relevance, and second-order effects."
        />
      )}

      {/* Error state */}
      {state.status === 'error' && (
        <ErrorState
          message={state.message}
          onRetry={reset}
        />
      )}

      {/* Results */}
      {state.status === 'success' && (
        <NewsAnalysisResults
          response={state.response}
          onNewAnalysis={reset}
        />
      )}
    </motion.div>
  );
}
