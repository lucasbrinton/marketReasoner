import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HistoryItem, StockHistoryItem, NewsHistoryItem, RiskHistoryItem, StrategyHistoryItem, ScreenerHistoryItem, DailyHistoryItem } from '../utils/storage';
import { MODULE_COLORS, MODULE_ICONS, MODULE_LABELS, CONFIDENCE_COLORS } from '../constants/theme';
import type { ModuleType } from '../constants/theme';
import { StockDetails, NewsDetails, RiskDetails, StrategyDetails, ScreenerDetails, DailyDetails } from './history-details';

interface HistoryCardProps {
  item: HistoryItem;
  onDelete: (id: string) => void;
}

function getSummary(item: HistoryItem): string {
  switch (item.type) {
    case 'stock':
      return `${item.input.ticker} • ${item.input.horizon} • ${item.input.style}`;
    case 'news':
      return `${item.input.stockOrSector} • ${item.input.newsText.slice(0, 50)}...`;
    case 'risk':
      return `Age ${item.input.age} • ${item.input.drawdownTolerance}% drawdown • ${item.input.capitalStability}`;
    case 'strategy':
      return `${item.input.strategyType} trading • ${item.input.riskLevel} risk`;
    case 'screener': {
      const passCount = [
        item.output.data.valuation.pass,
        item.output.data.growth_prospects.pass,
        item.output.data.financial_health.pass,
        item.output.data.competitive_advantage.pass,
        item.output.data.risk_factors.pass,
      ].filter(Boolean).length;
      return `${item.input.ticker} • ${passCount}/5 criteria passed`;
    }
    case 'daily': {
      const stepCount = Object.values(item.output.data.routine_steps).filter(Boolean).length;
      return `${stepCount} steps • ${item.output.data.time_allocation}`;
    }
  }
}

function getConfidence(item: HistoryItem): 'low' | 'medium' | 'high' {
  return item.output.data.confidence_level;
}

function renderDetails(item: HistoryItem) {
  switch (item.type) {
    case 'stock': return <StockDetails item={item as StockHistoryItem} />;
    case 'news': return <NewsDetails item={item as NewsHistoryItem} />;
    case 'risk': return <RiskDetails item={item as RiskHistoryItem} />;
    case 'strategy': return <StrategyDetails item={item as StrategyHistoryItem} />;
    case 'screener': return <ScreenerDetails item={item as ScreenerHistoryItem} />;
    case 'daily': return <DailyDetails item={item as DailyHistoryItem} />;
  }
}

export function HistoryCard({ item, onDelete }: HistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const moduleType = item.type as ModuleType;
  const Icon = MODULE_ICONS[moduleType];
  const colors = MODULE_COLORS[moduleType];
  const confidence = getConfidence(item);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="card"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-lg ${colors.bg}`}>
            <Icon className={`w-5 h-5 ${colors.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {MODULE_LABELS[moduleType]}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${CONFIDENCE_COLORS[confidence]}`}>
                {confidence} confidence
              </span>
            </div>
            <p className="text-sm text-text-primary font-medium mt-1 truncate">
              {getSummary(item)}
            </p>
            <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
              <Clock className="w-3 h-3" />
              {new Date(item.timestamp).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 rounded-lg text-text-muted hover:text-error hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border">
              {renderDetails(item)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
