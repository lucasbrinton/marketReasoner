import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, AlertCircle, TrendingUp, AlertTriangle, Brain, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { AnalysisLoadingState } from '../components/states/AnalysisLoadingState';
import { StrategySimulationResults } from '../components/strategy-results/StrategySimulationResults';
import { simulateStrategy } from '../api/client';
import { saveStrategySimulation } from '../utils/storage';
import { useAnalysis } from '../hooks/useAnalysis';
import {
  StrategySimulationRequest,
  StrategySimulationResponse,
  STRATEGY_TYPE_OPTIONS,
  RISK_LEVEL_OPTIONS
} from '../types';

export function StrategyPage() {
  // Form state
  const [strategyType, setStrategyType] = useState<StrategySimulationRequest['strategyType']>('swing');
  const [riskLevel, setRiskLevel] = useState<StrategySimulationRequest['riskLevel']>('medium');

  const saveFn = useCallback((request: StrategySimulationRequest, response: StrategySimulationResponse) => {
    saveStrategySimulation(request, response);
    toast.success('Strategy simulation complete!');
  }, []);

  const { state, submit, reset } = useAnalysis(simulateStrategy, saveFn);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const request: StrategySimulationRequest = { strategyType, riskLevel };
    submit(request);
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
            <Lightbulb className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Strategy Simulator</h1>
        </div>
        <p className="text-text-muted">
          Simulate how different trading strategies behave across market regimes.
          Identify failure modes, emotional traps, and unknowns.
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
            <form onSubmit={handleSubmit} className="card space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-semibold text-text-primary">Strategy Parameters</h2>
              </div>

              {/* Strategy Type Select */}
              <div>
                <label className="form-label">Strategy Type</label>
                <select
                  value={strategyType}
                  onChange={(e) => setStrategyType(e.target.value as StrategySimulationRequest['strategyType'])}
                  className="input w-full"
                >
                  {STRATEGY_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-text-muted mt-1">
                  {strategyType === 'swing' && 'Holding positions for days to weeks'}
                  {strategyType === 'intraday' && 'Opening and closing within the same day'}
                  {strategyType === 'position' && 'Holding positions for weeks to months'}
                </p>
              </div>

              {/* Risk Level Select */}
              <div>
                <label className="form-label">Risk Level</label>
                <select
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value as StrategySimulationRequest['riskLevel'])}
                  className="input w-full"
                >
                  {RISK_LEVEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-text-muted mt-1">
                  {riskLevel === 'low' && 'Conservative position sizing, tight stops'}
                  {riskLevel === 'medium' && 'Balanced risk/reward approach'}
                  {riskLevel === 'high' && 'Aggressive sizing, accepts larger drawdowns'}
                </p>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary w-full">
                <span className="flex items-center justify-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Simulate Strategy
                </span>
              </button>
            </form>
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
              icon={Lightbulb}
              title="Simulating Strategy with AI"
              subtitle="Analyzing behavior, risks, and uncertainties... (8-15s)"
              steps={[
                { icon: Lightbulb, label: 'Analyzing strategy type...' },
                { icon: TrendingUp, label: 'Simulating market regimes...' },
                { icon: AlertTriangle, label: 'Identifying failure modes...' },
                { icon: Brain, label: 'Detecting emotional traps...' },
                { icon: HelpCircle, label: 'Cataloging unknowns...' },
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
            <StrategySimulationResults response={state.response} onNewSimulation={reset} />
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
                Simulation Failed
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
