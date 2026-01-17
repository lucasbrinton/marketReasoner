/**
 * News Analysis Results Display
 * 
 * Renders the full news impact analysis in organized cards.
 */

import { useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { NewsAnalysisResponse } from '../../types';
import { NewsConfidenceBadge } from './NewsConfidenceBadge';
import { ShortTermImpactCard } from './ShortTermImpactCard';
import { LongTermImpactCard } from './LongTermImpactCard';
import { SecondOrderEffectsCard } from './SecondOrderEffectsCard';
import { NewsRisksCard } from './NewsRisksCard';
import { ExportButton } from '../ExportButton';

interface NewsAnalysisResultsProps {
  response: NewsAnalysisResponse;
  onNewAnalysis: () => void;
}

export function NewsAnalysisResults({ response, onNewAnalysis }: NewsAnalysisResultsProps) {
  const { data, meta } = response;
  const exportRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            {meta.stockOrSector} News Analysis
          </h2>
          <p className="text-sm text-text-muted mt-1">
            {meta.newsTextLength} characters analyzed • {new Date(meta.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton 
            targetRef={exportRef} 
            filename={`${meta.stockOrSector.replace(/[^a-zA-Z0-9]/g, '-')}-news-${new Date().toISOString().slice(0, 10)}`} 
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
        <NewsConfidenceBadge level={data.confidence_level} />
        <ShortTermImpactCard data={data.short_term_impact} />
        <LongTermImpactCard data={data.long_term_impact} />
        <SecondOrderEffectsCard effects={data.second_order_effects} />
        <NewsRisksCard risks={data.risks_and_uncertainties} />
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
