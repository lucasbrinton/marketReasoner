/**
 * Strategy Simulator Page
 * 
 * Fourth AI-powered feature - simulates strategy behavior across market regimes
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { StrategyLoadingState } from '../components/states/StrategyLoadingState';
import { StrategySimulationResults } from '../components/strategy-results/StrategySimulationResults';
import { simulateStrategy } from '../api/client';
import { saveStrategySimulation } from '../utils/storage';
import { 
  StrategySimulationRequest, 
  StrategySimulationResponse,
  STRATEGY_TYPE_OPTIONS,
  RISK_LEVEL_OPTIONS
} from '../types';

type PageState = 'form' | 'loading' | 'results' | 'error';

export function StrategyPage() {
  const [pageState, setPageState] = useState<PageState>('form');
  const [response, setResponse] = useState<StrategySimulationResponse | null>(null);
  const [error, setError] = useState<string>('');
  
  // Form state
  const [strategyType, setStrategyType] = useState<StrategySimulationRequest['strategyType']>('swing');
  const [riskLevel, setRiskLevel] = useState<StrategySimulationRequest['riskLevel']>('medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPageState('loading');
    setError('');

    const request: StrategySimulationRequest = { strategyType, riskLevel };

    try {
      const result = await simulateStrategy(request);
      setResponse(result);
      setPageState('results');

      // Save to history
      saveStrategySimulation(request, result);
      toast.success('Strategy simulation complete!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to simulate strategy';
      setError(message);
      setPageState('error');
      toast.error(message);
    }
  };

  const handleNewSimulation = () => {
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
        {pageState === 'form' && (
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

        {pageState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <StrategyLoadingState />
          </motion.div>
        )}

        {pageState === 'results' && response && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <StrategySimulationResults response={response} onNewSimulation={handleNewSimulation} />
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
                Simulation Failed
              </h3>
              <p className="text-sm text-text-muted mb-6 max-w-md">
                {error}
              </p>
              <button
                onClick={handleNewSimulation}
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
