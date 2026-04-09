import { useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { NewsAnalysisResponse } from '../../types';
import { ConfidenceBadge } from '../shared';
import { CONFIDENCE_CONFIGS } from '../../constants/theme';
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
        <ConfidenceBadge level={data.confidence_level} {...CONFIDENCE_CONFIGS.news} />
        <ShortTermImpactCard data={data.short_term_impact} />
        <LongTermImpactCard data={data.long_term_impact} />
        <SecondOrderEffectsCard effects={data.second_order_effects} />
        <NewsRisksCard risks={data.risks_and_uncertainties} />
      </div>

    </div>
  );
}
