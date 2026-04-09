import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Search, Info, DollarSign, TrendingUp, Shield, Award, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { screenStock } from '../api/client';
import { saveScreenerResult } from '../utils/storage';
import { useAnalysis } from '../hooks/useAnalysis';
import { AnalysisLoadingState } from '../components/states/AnalysisLoadingState';
import { ScreenerResults } from '../components/screener-results/ScreenerResults';
import type { StockScreenResponse } from '../types';
import { StockScreenRequestSchema, type StockScreenRequest } from '../types';

export function ScreenerPage() {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors }
  } = useForm<StockScreenRequest>({
    resolver: zodResolver(StockScreenRequestSchema),
    defaultValues: { ticker: '' }
  });

  const saveFn = useCallback((request: StockScreenRequest, response: StockScreenResponse) => {
    saveScreenerResult(request, response);
    toast.success(`${request.ticker} screening complete!`);
  }, []);

  const { state, submit, reset } = useAnalysis(screenStock, saveFn);

  const onSubmit = (data: StockScreenRequest) => {
    submit({ ticker: data.ticker.trim().toUpperCase() });
  };

  const handleNewScreen = () => {
    resetForm();
    reset();
  };

  // Show results if available
  if (state.status === 'success') {
    return (
      <div className="space-y-6">
        <ScreenerResults response={state.response} onNewScreen={handleNewScreen} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          AI Stock Screener
        </h1>
        <p className="text-text-secondary">
          Screen stocks against 5 quality criteria using AI reasoning
        </p>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card bg-accent/5 border-accent/20"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent mt-0.5" />
          <div className="text-sm text-text-secondary">
            <p className="font-medium text-text-primary mb-1">How It Works</p>
            <p>
              Enter a ticker symbol and our AI will evaluate it against 5 key criteria:
              <span className="font-medium text-text-primary"> Valuation</span>,
              <span className="font-medium text-text-primary"> Growth Prospects</span>,
              <span className="font-medium text-text-primary"> Financial Health</span>,
              <span className="font-medium text-text-primary"> Competitive Advantage</span>, and
              <span className="font-medium text-text-primary"> Risk Factors</span>.
              Each criterion is marked as PASS or FAIL with detailed reasoning.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Input Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit(onSubmit)}
        className="card"
      >
        <label htmlFor="ticker" className="block text-sm font-medium text-text-primary mb-2">
          Ticker Symbol
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            id="ticker"
            placeholder="e.g., AAPL, MSFT, GOOGL"
            className="input flex-1 uppercase"
            disabled={state.status === 'loading'}
            maxLength={10}
            {...register('ticker')}
          />
          <button
            type="submit"
            disabled={state.status === 'loading'}
            className="btn btn-primary flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Screen
          </button>
        </div>
        {errors.ticker && (
          <p className="text-sm text-error mt-1">{errors.ticker.message}</p>
        )}
        <p className="text-xs text-text-muted mt-2">
          Tip: Use well-known US stock tickers for best results
        </p>
      </motion.form>

      {/* Loading State */}
      {state.status === 'loading' && (
        <AnalysisLoadingState
          icon={Search}
          title="Screening Stock with AI"
          subtitle="Evaluating against quality criteria... (8-15s)"
          steps={[
            { icon: Search, label: 'Analyzing stock data...' },
            { icon: DollarSign, label: 'Evaluating valuation...' },
            { icon: TrendingUp, label: 'Assessing growth prospects...' },
            { icon: Shield, label: 'Checking financial health...' },
            { icon: Award, label: 'Reviewing competitive advantage...' },
            { icon: AlertTriangle, label: 'Identifying weaknesses...' },
          ]}
        />
      )}

      {/* Error State */}
      {state.status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-error bg-error/5"
        >
          <p className="text-sm text-error">{state.message}</p>
          <button
            onClick={handleNewScreen}
            className="btn btn-secondary mt-4"
          >
            Try Again
          </button>
        </motion.div>
      )}

    </div>
  );
}
