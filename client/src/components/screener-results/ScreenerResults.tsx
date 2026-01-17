/**
 * Stock Screening Results Display
 */

import { useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { StockScreenResponse } from '../../types';
import { ScreenerConfidenceBadge } from './ScreenerConfidenceBadge';
import { CriterionCard } from './CriterionCard';
import { OverallAssessmentCard } from './OverallAssessmentCard';
import { WeaknessesCard } from './WeaknessesCard';
import { ExportButton } from '../ExportButton';

interface ScreenerResultsProps {
  response: StockScreenResponse;
  onNewScreen: () => void;
}

export function ScreenerResults({ response, onNewScreen }: ScreenerResultsProps) {
  const { data, meta } = response;
  const exportRef = useRef<HTMLDivElement>(null);

  // Calculate pass count
  const criteria = [
    { key: 'valuation', label: 'Valuation', data: data.valuation },
    { key: 'growth_prospects', label: 'Growth Prospects', data: data.growth_prospects },
    { key: 'financial_health', label: 'Financial Health', data: data.financial_health },
    { key: 'competitive_advantage', label: 'Competitive Advantage', data: data.competitive_advantage },
    { key: 'risk_factors', label: 'Risk Factors', data: data.risk_factors }
  ];

  const passCount = criteria.filter(c => c.data.pass).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            {meta.ticker} Screening Results
          </h2>
          <p className="text-sm text-text-muted mt-1">
            {passCount}/5 criteria passed • {new Date(meta.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton 
            targetRef={exportRef} 
            filename={`screen-${meta.ticker}-${new Date().toISOString().slice(0, 10)}`} 
          />
          <button
            onClick={onNewScreen}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            New Screen
          </button>
        </div>
      </div>

      {/* Exportable Content */}
      <div ref={exportRef} className="space-y-4">
        <ScreenerConfidenceBadge level={data.confidence_level} passCount={passCount} />
        
        {/* Criteria Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criteria.map((criterion) => (
            <CriterionCard 
              key={criterion.key}
              label={criterion.label}
              pass={criterion.data.pass}
              explanation={criterion.data.explanation}
            />
          ))}
        </div>

        <OverallAssessmentCard assessment={data.overall_assessment} />
        <WeaknessesCard weaknesses={data.weaknesses} />
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-6">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>⚠️ Important:</strong> This screening is for educational purposes only. 
          It is not a buy or sell recommendation. Passing criteria does not guarantee future performance.
          Always conduct your own research.
        </p>
      </div>
    </div>
  );
}
