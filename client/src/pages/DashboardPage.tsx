import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Zap
} from 'lucide-react';
import { checkHealth } from '../api/client';
import { getHistory, HistoryItem } from '../utils/storage';
import { MODULE_COLORS, MODULE_ICONS } from '../constants/theme';
import type { ModuleType } from '../constants/theme';

const modules: { path: string; label: string; moduleType: ModuleType; description: string }[] = [
  { path: '/stocks', label: 'Stock Analysis', moduleType: 'stock', description: 'Deep analysis of any stock with AI reasoning' },
  { path: '/news', label: 'News Impact', moduleType: 'news', description: 'Analyze how news affects stocks and sectors' },
  { path: '/risk', label: 'Risk Profiler', moduleType: 'risk', description: 'Build personalized risk management frameworks' },
  { path: '/strategy', label: 'Strategy Simulator', moduleType: 'strategy', description: 'Simulate and stress-test trading strategies' },
  { path: '/screener', label: 'Stock Screener', moduleType: 'screener', description: 'Screen stocks against quality criteria' },
  { path: '/daily', label: 'Daily Brain', moduleType: 'daily', description: 'Generate daily market review routines' },
];

export function DashboardPage() {
  const navigate = useNavigate();
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
          const colors = MODULE_COLORS[module.moduleType];
          const ModuleIcon = MODULE_ICONS[module.moduleType];
          return (
            <motion.button
              key={module.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              onClick={() => navigate(module.path)}
              className={`card text-left border ${colors.border} hover:shadow-lg transition-all group`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <ModuleIcon className={`w-6 h-6 ${colors.text}`} />
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
            <Link
              to="/history"
              className="text-sm text-accent hover:underline"
            >
              View All →
            </Link>
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
