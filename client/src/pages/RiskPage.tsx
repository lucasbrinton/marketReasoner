/**
 * Risk Manager Page
 * 
 * Personal risk framework generator - the third AI-powered feature
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { RiskForm } from '../components/form/RiskForm';
import { RiskLoadingState } from '../components/states/RiskLoadingState';
import { RiskProfileResults } from '../components/risk-results/RiskProfileResults';
import { analyzeRisk } from '../api/client';
import { saveRiskAnalysis } from '../utils/storage';
import { RiskProfileRequest, RiskProfileResponse } from '../types';

type PageState = 'form' | 'loading' | 'results' | 'error';

export function RiskPage() {
  const [pageState, setPageState] = useState<PageState>('form');
  const [response, setResponse] = useState<RiskProfileResponse | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (data: RiskProfileRequest) => {
    setPageState('loading');
    setError('');

    try {
      const result = await analyzeRisk(data);
      setResponse(result);
      setPageState('results');

      // Save to history
      saveRiskAnalysis(data, result);
      toast.success('Risk framework generated!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate risk framework';
      setError(message);
      setPageState('error');
      toast.error(message);
    }
  };

  const handleNewAnalysis = () => {
    setResponse(null);
    setPageState('form');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Shield className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Risk Manager</h1>
        </div>
        <p className="text-text-muted">
          Generate a personalized risk framework based on your age, goals, and risk tolerance.
          Get exposure bands, risk limits, and rebalancing guidance.
        </p>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {pageState === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <RiskForm onSubmit={handleSubmit} isLoading={false} />
          </motion.div>
        )}

        {pageState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <RiskLoadingState />
          </motion.div>
        )}

        {pageState === 'results' && response && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <RiskProfileResults response={response} onNewAnalysis={handleNewAnalysis} />
          </motion.div>
        )}

        {pageState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            <div className="flex flex-col items-center text-center py-8">
              <div className="p-3 bg-error/10 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-error" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Analysis Failed
              </h3>
              <p className="text-sm text-text-muted mb-6 max-w-md">
                {error}
              </p>
              <button
                onClick={handleNewAnalysis}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
