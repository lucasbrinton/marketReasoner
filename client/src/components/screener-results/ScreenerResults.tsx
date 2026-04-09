import { useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { StockScreenResponse } from '../../types';
import { CheckCircle2 } from 'lucide-react';
import { ConfidenceBadge } from '../shared';
import { CONFIDENCE_CONFIGS } from '../../constants/theme';
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
        <ConfidenceBadge
          level={data.confidence_level}
          {...CONFIDENCE_CONFIGS.screener}
          extra={
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-text-secondary">{passCount}/5 criteria passed</span>
            </div>
          }
        />
        
        {/* Criteria Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 [&>:last-child:nth-child(odd)]:md:col-span-2 [&>:last-child:nth-child(odd)]:md:max-w-[calc(50%-0.5rem)] [&>:last-child:nth-child(odd)]:md:mx-auto">
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

    </div>
  );
}
