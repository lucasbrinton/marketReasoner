import { useState, useEffect } from 'react';
import { History, Trash2, FileX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { HistoryCard } from '../components/HistoryCard';
import { getHistory, clearHistory, deleteHistoryItem, HistoryItem } from '../utils/storage';
import { MODULE_COLORS } from '../constants/theme';
import type { ModuleType } from '../constants/theme';

const FILTER_TABS = [
  { key: 'all' as const, label: 'All', color: 'bg-accent' },
  ...(['stock', 'news', 'risk', 'strategy', 'screener', 'daily'] as const).map(key => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    color: MODULE_COLORS[key as ModuleType].solid,
  })),
];

export function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'stock' | 'news' | 'risk' | 'strategy' | 'screener' | 'daily'>('all');

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Dismiss clear-history modal on Escape key
  useEffect(() => {
    if (!showClearConfirm) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowClearConfirm(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showClearConfirm]);

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setHistory(getHistory());
    toast.success('Item deleted');
  };

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
    setShowClearConfirm(false);
    toast.success('History cleared');
  };

  const filteredHistory = history.filter(item => 
    filter === 'all' ? true : item.type === filter
  );

  const counts = history.reduce<Record<string, number>>((acc, h) => {
    acc[h.type] = (acc[h.type] || 0) + 1;
    return acc;
  }, {});


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <History className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Analysis History</h1>
            <p className="text-sm text-text-muted">
              {history.length} saved {history.length === 1 ? 'analysis' : 'analyses'}
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="btn btn-secondary flex items-center gap-2 text-error hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      {history.length > 0 && (
        <div className="flex items-center gap-2">
          {FILTER_TABS.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === key
                  ? `${color} text-white`
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {label} ({key === 'all' ? history.length : counts[key] || 0})
            </button>
          ))}
        </div>
      )}

      {/* History List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredHistory.length > 0 ? (
            filteredHistory.map(item => (
              <HistoryCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
              />
            ))
          ) : history.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card text-center py-12"
            >
              <p className="text-text-muted">No {filter} analyses found.</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {history.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center py-16"
        >
          <FileX className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            No history yet
          </h2>
          <p className="text-text-secondary max-w-md mx-auto">
            Run a stock or news analysis to start building your history.
            Your analyses will be saved locally for future reference.
          </p>
        </motion.div>
      )}

      {/* Clear Confirmation Dialog */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="presentation"
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="clear-dialog-title"
              className="bg-surface rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <h3 id="clear-dialog-title" className="text-lg font-semibold text-text-primary mb-2">
                Clear All History?
              </h3>
              <p className="text-text-secondary mb-6">
                This will permanently delete all {history.length} saved analyses. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="btn bg-error text-white hover:bg-red-700 focus:ring-error"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
