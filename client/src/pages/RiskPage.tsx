import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertCircle, TrendingUp, AlertTriangle, Scale, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { RiskForm } from '../components/form/RiskForm';
import { AnalysisLoadingState } from '../components/states/AnalysisLoadingState';
import { RiskProfileResults } from '../components/risk-results/RiskProfileResults';
import { analyzeRisk } from '../api/client';
import { saveRiskAnalysis } from '../utils/storage';
import { useAnalysis } from '../hooks/useAnalysis';
import type { RiskProfileRequest, RiskProfileResponse } from '../types';

export function RiskPage() {
  const saveFn = useCallback((request: RiskProfileRequest, response: RiskProfileResponse) => {
    saveRiskAnalysis(request, response);
    toast.success('Risk framework generated!');
  }, []);

  const { state, submit, reset } = useAnalysis(analyzeRisk, saveFn);

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
        {state.status === 'idle' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <RiskForm onSubmit={submit} isLoading={false} />
          </motion.div>
        )}

        {state.status === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AnalysisLoadingState
              icon={Shield}
              title="Building Your Risk Framework"
              subtitle="Creating a personalized risk management plan..."
              steps={[
                { icon: Shield, label: 'Analyzing risk tolerance...' },
                { icon: TrendingUp, label: 'Calculating exposure bands...' },
                { icon: AlertTriangle, label: 'Setting risk limits...' },
                { icon: Scale, label: 'Building rebalancing logic...' },
                { icon: Clock, label: 'Defining time horizons...' },
              ]}
            />
          </motion.div>
        )}

        {state.status === 'success' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <RiskProfileResults response={state.response} onNewAnalysis={reset} />
          </motion.div>
        )}

        {state.status === 'error' && (
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
                {state.message}
              </p>
              <button
                onClick={reset}
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
