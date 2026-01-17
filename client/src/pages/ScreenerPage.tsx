/**
 * Stock Screener Page
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { screenStock } from '../api/client';
import { StockScreenResponse } from '../types';
import { saveScreenerResult } from '../utils/storage';
import { ScreenerLoadingState } from '../components/states/ScreenerLoadingState';
import { ScreenerResults } from '../components/screener-results/ScreenerResults';

export function ScreenerPage() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<StockScreenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedTicker = ticker.trim().toUpperCase();
    if (!trimmedTicker) {
      toast.error('Please enter a ticker symbol');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await screenStock({ ticker: trimmedTicker });
      setResponse(result);
      saveScreenerResult({ ticker: trimmedTicker }, result);
      toast.success(`${trimmedTicker} screening complete!`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to screen stock';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewScreen = () => {
    setTicker('');
    setResponse(null);
    setError(null);
  };

  // Show results if available
  if (response) {
    return (
      <div className="space-y-6">
        <ScreenerResults response={response} onNewScreen={handleNewScreen} />
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
        onSubmit={handleSubmit}
        className="card"
      >
        <label htmlFor="ticker" className="block text-sm font-medium text-text-primary mb-2">
          Ticker Symbol
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            id="ticker"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="e.g., AAPL, MSFT, GOOGL"
            className="input flex-1"
            disabled={loading}
            maxLength={10}
          />
          <button
            type="submit"
            disabled={loading || !ticker.trim()}
            className="btn btn-primary flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Screen
          </button>
        </div>
        <p className="text-xs text-text-muted mt-2">
          Tip: Use well-known US stock tickers for best results
        </p>
      </motion.form>

      {/* Loading State */}
      {loading && <ScreenerLoadingState />}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-error bg-error/5"
        >
          <p className="text-sm text-error">{error}</p>
          <button
            onClick={handleNewScreen}
            className="btn btn-secondary mt-4"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-xs text-text-muted"
      >
        <p>
          ⚠️ This screener is for educational purposes only and does not constitute investment advice.
        </p>
      </motion.div>
    </div>
  );
}
