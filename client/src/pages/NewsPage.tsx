/**
 * News Page
 * 
 * Page for running news impact analysis.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { NewsForm } from '../components/form/NewsForm';
import { NewsAnalysisResults } from '../components/news-results/NewsAnalysisResults';
import { NewsLoadingState } from '../components/states/NewsLoadingState';
import { ErrorState } from '../components/states/ErrorState';
import { analyzeNews, AnalysisError } from '../api/client';
import { NewsAnalysisRequest, NewsAnalysisResponse } from '../types';
import { saveNewsAnalysis } from '../utils/storage';

type PageState = 
  | { status: 'idle' }
  | { status: 'loading'; stockOrSector: string; request: NewsAnalysisRequest }
  | { status: 'success'; response: NewsAnalysisResponse; request: NewsAnalysisRequest }
  | { status: 'error'; message: string };

export function NewsPage() {
  const [state, setState] = useState<PageState>({ status: 'idle' });

  const handleSubmit = async (data: NewsAnalysisRequest) => {
    setState({ status: 'loading', stockOrSector: data.stockOrSector, request: data });

    try {
      const response = await analyzeNews(data);
      setState({ status: 'success', response, request: data });
      
      // Save to history
      saveNewsAnalysis(data, response);
      toast.success(`News analysis for ${data.stockOrSector} saved to history`);
    } catch (error) {
      if (error instanceof AnalysisError) {
        toast.error(error.getUserMessage());
        setState({ status: 'error', message: error.getUserMessage() });
      } else {
        toast.error('An unexpected error occurred');
        setState({ 
          status: 'error', 
          message: 'An unexpected error occurred. Please try again.' 
        });
      }
    }
  };

  const handleReset = () => {
    setState({ status: 'idle' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Always show form unless showing results */}
      {state.status !== 'success' && (
        <NewsForm 
          onSubmit={handleSubmit} 
          isLoading={state.status === 'loading'} 
        />
      )}

      {/* Loading state */}
      {state.status === 'loading' && (
        <NewsLoadingState stockOrSector={state.stockOrSector} />
      )}

      {/* Error state */}
      {state.status === 'error' && (
        <ErrorState 
          message={state.message} 
          onRetry={handleReset} 
        />
      )}

      {/* Results */}
      {state.status === 'success' && (
        <NewsAnalysisResults 
          response={state.response} 
          onNewAnalysis={handleReset} 
        />
      )}
    </motion.div>
  );
}
