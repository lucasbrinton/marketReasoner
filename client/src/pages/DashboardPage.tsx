/**
 * Dashboard Page - Home/Overview
 * 
 * Quick access to all modules with status and recent history.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Newspaper, 
  Shield, 
  Lightbulb, 
  Search, 
  Brain, 
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Zap
} from 'lucide-react';
import { checkHealth } from '../api/client';
import { getHistory, HistoryItem } from '../utils/storage';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

const modules = [
  { 
    key: 'stocks', 
    label: 'Stock Analysis', 
    icon: TrendingUp, 
    color: 'blue',
    description: 'Deep analysis of any stock with AI reasoning'
  },
  { 
    key: 'news', 
    label: 'News Impact', 
    icon: Newspaper, 
    color: 'purple',
    description: 'Analyze how news affects stocks and sectors'
  },
  { 
    key: 'risk', 
    label: 'Risk Profiler', 
    icon: Shield, 
    color: 'green',
    description: 'Build personalized risk management frameworks'
  },
  { 
    key: 'strategy', 
    label: 'Strategy Simulator', 
    icon: Lightbulb, 
    color: 'amber',
    description: 'Simulate and stress-test trading strategies'
  },
  { 
    key: 'screener', 
    label: 'Stock Screener', 
    icon: Search, 
    color: 'cyan',
    description: 'Screen stocks against quality criteria'
  },
  { 
    key: 'daily', 
    label: 'Daily Brain', 
    icon: Brain, 
    color: 'pink',
    description: 'Generate daily market review routines'
  }
];

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  green: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800' }
};

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [apiStatus, setApiStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [llmConfigured, setLlmConfigured] = useState(false);
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Check API health
    checkHealth()
      .then(data => {
        setApiStatus('ok');
        setLlmConfigured(data.llmConfigured);
      })
      .catch(() => {
        setApiStatus('error');
      });

    // Load recent history
    const history = getHistory().slice(0, 5);
    setRecentHistory(history);
  }, []);

  const getHistoryLabel = (item: HistoryItem) => {
    switch (item.type) {
      case 'stock': return `Stock: ${item.input.ticker}`;
      case 'news': return `News: ${item.input.stockOrSector}`;
      case 'risk': return `Risk Profile`;
      case 'strategy': return `Strategy: ${item.input.strategyType}`;
      case 'screener': return `Screen: ${item.input.ticker}`;
      case 'daily': return 'Daily Routine';
      default: return 'Analysis';
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-2xl mb-4">
          <Zap className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          Welcome to MarketMind
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          AI-powered market analysis platform with 6 specialized modules for comprehensive market intelligence.
        </p>
      </motion.div>

      {/* Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {apiStatus === 'loading' ? (
                <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
              ) : apiStatus === 'ok' ? (
                <CheckCircle2 className="w-4 h-4 text-success" />
              ) : (
                <XCircle className="w-4 h-4 text-error" />
              )}
              <span className="text-sm text-text-secondary">
                API: {apiStatus === 'loading' ? 'Checking...' : apiStatus === 'ok' ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            {apiStatus === 'ok' && (
              <div className="flex items-center gap-2">
                {llmConfigured ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-sm text-text-secondary">
                  AI: {llmConfigured ? 'Ready' : 'Not Configured'}
                </span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-text-muted">
            v1.0.0 • {recentHistory.length} analyses saved
          </div>
        </div>
      </motion.div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module, idx) => {
          const colors = colorClasses[module.color];
          return (
            <motion.button
              key={module.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              onClick={() => onNavigate(module.key)}
              className={`card text-left border ${colors.border} hover:shadow-lg transition-all group`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <module.icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {module.label}
                  </h3>
                  <p className="text-sm text-text-muted mt-1">
                    {module.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Recent History */}
      {recentHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-text-primary">Recent Analyses</h3>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-sm text-accent hover:underline"
            >
              View All →
            </button>
          </div>
          
          <div className="space-y-2">
            {recentHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-surface-alt rounded-lg"
              >
                <span className="text-sm text-text-primary">
                  {getHistoryLabel(item)}
                </span>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Clock className="w-3 h-3" />
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-text-muted"
      >
        <p>
          ⚠️ MarketMind is for educational and research purposes only. 
          Not investment advice. No buy/sell recommendations.
        </p>
      </motion.div>
    </div>
  );
}
