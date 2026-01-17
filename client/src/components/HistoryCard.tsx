/**
 * History Card Component
 * 
 * Displays a single history item in a card format.
 */

import { useState } from 'react';
import { TrendingUp, Newspaper, Shield, Lightbulb, Search, Brain, ChevronDown, ChevronUp, Trash2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryItem, StockHistoryItem, NewsHistoryItem, RiskHistoryItem, StrategyHistoryItem, ScreenerHistoryItem, DailyHistoryItem } from '../utils/storage';

interface HistoryCardProps {
  item: HistoryItem;
  onDelete: (id: string) => void;
}

export function HistoryCard({ item, onDelete }: HistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isStock = item.type === 'stock';
  const isNews = item.type === 'news';
  const isRisk = item.type === 'risk';
  const isStrategy = item.type === 'strategy';
  const isScreener = item.type === 'screener';
  const isDaily = item.type === 'daily';
  
  const Icon = isStock ? TrendingUp : isNews ? Newspaper : isRisk ? Shield : isStrategy ? Lightbulb : isScreener ? Search : Brain;
  const iconBg = isStock ? 'bg-blue-100 dark:bg-blue-900/30' : isNews ? 'bg-purple-100 dark:bg-purple-900/30' : isRisk ? 'bg-green-100 dark:bg-green-900/30' : isStrategy ? 'bg-amber-100 dark:bg-amber-900/30' : isScreener ? 'bg-cyan-100 dark:bg-cyan-900/30' : 'bg-pink-100 dark:bg-pink-900/30';
  const iconColor = isStock ? 'text-blue-600 dark:text-blue-400' : isNews ? 'text-purple-600 dark:text-purple-400' : isRisk ? 'text-green-600 dark:text-green-400' : isStrategy ? 'text-amber-600 dark:text-amber-400' : isScreener ? 'text-cyan-600 dark:text-cyan-400' : 'text-pink-600 dark:text-pink-400';
  
  // Get summary info
  const getSummary = () => {
    if (isStock) {
      const stockItem = item as StockHistoryItem;
      return `${stockItem.input.ticker} • ${stockItem.input.horizon} • ${stockItem.input.style}`;
    } else if (isNews) {
      const newsItem = item as NewsHistoryItem;
      return `${newsItem.input.stockOrSector} • ${newsItem.input.newsText.slice(0, 50)}...`;
    } else if (isRisk) {
      const riskItem = item as RiskHistoryItem;
      return `Age ${riskItem.input.age} • ${riskItem.input.drawdownTolerance}% drawdown • ${riskItem.input.capitalStability}`;
    } else if (isStrategy) {
      const strategyItem = item as StrategyHistoryItem;
      return `${strategyItem.input.strategyType} trading • ${strategyItem.input.riskLevel} risk`;
    } else if (isScreener) {
      const screenerItem = item as ScreenerHistoryItem;
      const passCount = [
        screenerItem.output.data.valuation.pass,
        screenerItem.output.data.growth_prospects.pass,
        screenerItem.output.data.financial_health.pass,
        screenerItem.output.data.competitive_advantage.pass,
        screenerItem.output.data.risk_factors.pass
      ].filter(Boolean).length;
      return `${screenerItem.input.ticker} • ${passCount}/5 criteria passed`;
    } else {
      const dailyItem = item as DailyHistoryItem;
      const stepCount = Object.values(dailyItem.output.data.routine_steps).filter(Boolean).length;
      return `${stepCount} steps • ${dailyItem.output.data.time_allocation}`;
    }
  };

  const getConfidence = () => {
    if (isStock) return (item as StockHistoryItem).output.data.confidence_level;
    if (isNews) return (item as NewsHistoryItem).output.data.confidence_level;
    if (isRisk) return (item as RiskHistoryItem).output.data.confidence_level;
    if (isStrategy) return (item as StrategyHistoryItem).output.data.confidence_level;
    if (isScreener) return (item as ScreenerHistoryItem).output.data.confidence_level;
    return (item as DailyHistoryItem).output.data.confidence_level;
  };

  const confidence = getConfidence();
  const typeLabel = isStock ? 'Stock' : isNews ? 'News' : isRisk ? 'Risk' : isStrategy ? 'Strategy' : isScreener ? 'Screener' : 'Daily';

  const confidenceColors = {
    high: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    low: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };

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
          <div className={`p-2 rounded-lg ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {typeLabel}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${confidenceColors[confidence]}`}>
                {confidence} confidence
              </span>
            </div>
            <p className="text-sm text-text-primary font-medium mt-1 truncate">
              {getSummary()}
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
              {isStock && <StockDetails item={item as StockHistoryItem} />}
              {isNews && <NewsDetails item={item as NewsHistoryItem} />}
              {isRisk && <RiskDetails item={item as RiskHistoryItem} />}
              {isStrategy && <StrategyDetails item={item as StrategyHistoryItem} />}
              {isScreener && <ScreenerDetails item={item as ScreenerHistoryItem} />}
              {isDaily && <DailyDetails item={item as DailyHistoryItem} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StockDetails({ item }: { item: StockHistoryItem }) {
  const { data } = item.output;
  
  return (
    <div className="space-y-4">
      {/* Business Model */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Business Model</h4>
        <p className="text-sm text-text-secondary">{data.business_model}</p>
      </div>
      
      {/* Financial Health */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Financial Health</h4>
        <p className="text-sm text-text-secondary">{data.financial_health.summary}</p>
      </div>
      
      {/* Competitive Edge */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">
          Competitive Edge ({data.competitive_edge.moat} moat)
        </h4>
        <p className="text-sm text-text-secondary">{data.competitive_edge.explanation}</p>
      </div>
      
      {/* Risks Summary */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Key Risks</h4>
        <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
          {data.risks.short_term.slice(0, 2).map((risk, i) => (
            <li key={i}>{risk}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function NewsDetails({ item }: { item: NewsHistoryItem }) {
  const { data } = item.output;
  
  return (
    <div className="space-y-4">
      {/* Short Term Impact */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Short-Term Impact</h4>
        <p className="text-sm text-text-secondary"><strong>Emotional:</strong> {data.short_term_impact.emotional}</p>
        <p className="text-sm text-text-secondary mt-1"><strong>Business:</strong> {data.short_term_impact.business_relevance}</p>
      </div>
      
      {/* Long Term Impact */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Long-Term Impact</h4>
        <p className="text-sm text-text-secondary">{data.long_term_impact.signal_vs_noise}</p>
      </div>
      
      {/* Second Order Effects */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Second-Order Effects</h4>
        <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
          {data.second_order_effects.slice(0, 3).map((effect, i) => (
            <li key={i}>{effect}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RiskDetails({ item }: { item: RiskHistoryItem }) {
  const { data } = item.output;
  
  return (
    <div className="space-y-4">
      {/* Exposure Bands */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Exposure Bands</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-text-secondary">
          <span>Equities: {data.exposure_bands.equities}</span>
          <span>Fixed Income: {data.exposure_bands.fixed_income}</span>
          <span>Alternatives: {data.exposure_bands.alternatives}</span>
          <span>Cash: {data.exposure_bands.cash}</span>
        </div>
      </div>
      
      {/* Risk Limits */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Risk Limits</h4>
        <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
          {data.risk_limits.slice(0, 3).map((limit, i) => (
            <li key={i}>{limit}</li>
          ))}
        </ul>
      </div>
      
      {/* Rebalancing */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Rebalancing Logic</h4>
        <p className="text-sm text-text-secondary">{data.rebalancing_logic}</p>
      </div>
    </div>
  );
}

function StrategyDetails({ item }: { item: StrategyHistoryItem }) {
  const { data } = item.output;
  
  return (
    <div className="space-y-4">
      {/* Behavior in Regimes */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Behavior in Market Regimes</h4>
        <p className="text-sm text-text-secondary"><strong>Trend:</strong> {data.behavior_in_regimes.trend}</p>
        <p className="text-sm text-text-secondary mt-1"><strong>Range:</strong> {data.behavior_in_regimes.range}</p>
        <p className="text-sm text-text-secondary mt-1"><strong>Volatility:</strong> {data.behavior_in_regimes.high_volatility}</p>
      </div>
      
      {/* Failure Modes */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Failure Modes</h4>
        <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
          {data.failure_modes.slice(0, 3).map((mode, i) => (
            <li key={i}>{mode}</li>
          ))}
        </ul>
      </div>
      
      {/* Emotional Traps */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Emotional Traps</h4>
        <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
          {data.emotional_traps.slice(0, 3).map((trap, i) => (
            <li key={i}>{trap}</li>
          ))}
        </ul>
      </div>
      
      {/* Risk Profile */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Risk Profile</h4>
        <p className="text-sm text-text-secondary">{data.risk_profile}</p>
      </div>
    </div>
  );
}

function ScreenerDetails({ item }: { item: ScreenerHistoryItem }) {
  const { data } = item.output;
  
  const criteria = [
    { label: 'Valuation', ...data.valuation },
    { label: 'Growth Prospects', ...data.growth_prospects },
    { label: 'Financial Health', ...data.financial_health },
    { label: 'Competitive Advantage', ...data.competitive_advantage },
    { label: 'Risk Factors', ...data.risk_factors }
  ];
  
  return (
    <div className="space-y-4">
      {/* Criteria Summary */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-2">Criteria Results</h4>
        <div className="space-y-2">
          {criteria.map((criterion, i) => (
            <div key={i} className="flex items-start gap-2">
              {criterion.pass ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <span className="text-sm font-medium text-text-primary">{criterion.label}</span>
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                  criterion.pass 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {criterion.pass ? 'PASS' : 'FAIL'}
                </span>
                <p className="text-xs text-text-muted mt-0.5">{criterion.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Overall Assessment */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Overall Assessment</h4>
        <p className="text-sm text-text-secondary">{data.overall_assessment}</p>
      </div>
      
      {/* Weaknesses */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Key Weaknesses</h4>
        <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
          {data.weaknesses.slice(0, 3).map((weakness, i) => (
            <li key={i}>{weakness}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DailyDetails({ item }: { item: DailyHistoryItem }) {
  const { data } = item.output;
  
  // Convert steps to array
  const steps = Object.entries(data.routine_steps)
    .filter(([_, v]) => v)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({
      number: parseInt(key.replace('step', '')),
      description: value as string
    }));
  
  return (
    <div className="space-y-4">
      {/* Routine Steps */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-2">Routine Steps ({data.time_allocation})</h4>
        <div className="space-y-2">
          {steps.map((step) => (
            <div key={step.number} className="flex items-start gap-2 text-sm">
              <span className="text-accent font-bold">{step.number}.</span>
              <span className="text-text-secondary">{step.description}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Tips */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Tips for Consistency</h4>
        <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
          {data.tips_for_consistency.slice(0, 3).map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
      
      {/* Pitfalls */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Potential Pitfalls</h4>
        <ul className="text-sm text-text-secondary list-disc list-inside space-y-1">
          {data.potential_pitfalls.slice(0, 3).map((pitfall, i) => (
            <li key={i}>{pitfall}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
