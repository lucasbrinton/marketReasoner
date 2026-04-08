import { useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { AnalysisResponse } from '../../types';
import { BusinessModelCard } from './BusinessModelCard';
import { FinancialHealthCard } from './FinancialHealthCard';
import { CompetitiveEdgeCard } from './CompetitiveEdgeCard';
import { RisksCard } from './RisksCard';
import { ConfidenceBadge } from '../shared';
import { CONFIDENCE_CONFIGS } from '../../constants/theme';
import { ExportButton } from '../ExportButton';

interface AnalysisResultsProps {
  response: AnalysisResponse;
  onNewAnalysis: () => void;
}

export function AnalysisResults({ response, onNewAnalysis }: AnalysisResultsProps) {
  const { data, meta } = response;
  const exportRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            {meta.ticker} Analysis
          </h2>
          <p className="text-sm text-text-muted mt-1">
            {meta.horizon.charAt(0).toUpperCase() + meta.horizon.slice(1)} horizon • {meta.style.charAt(0).toUpperCase() + meta.style.slice(1)} style • {new Date(meta.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton 
            targetRef={exportRef} 
            filename={`${meta.ticker}-analysis-${new Date().toISOString().slice(0, 10)}`} 
          />
          <button
            onClick={onNewAnalysis}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            New Analysis
          </button>
        </div>
      </div>

      {/* Exportable Content */}
      <div ref={exportRef} className="space-y-4">
        {/* Analysis Cards */}
        <ConfidenceBadge level={data.confidence_level} {...CONFIDENCE_CONFIGS.stock} />
        <BusinessModelCard content={data.business_model} />
        <FinancialHealthCard data={data.financial_health} />
        <CompetitiveEdgeCard data={data.competitive_edge} />
        <RisksCard data={data.risks} />
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-6">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>⚠️ Important:</strong> This analysis is for educational and research purposes only. 
          It does not constitute investment advice. No buy, sell, or hold recommendations are provided. 
          Always conduct your own research and consult with qualified professionals before making investment decisions.
        </p>
      </div>
    </div>
  );
}
