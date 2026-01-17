/**
 * Risk Profile Results Display
 * 
 * Renders the full risk profile analysis in organized cards.
 */

import { useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { RiskProfileResponse } from '../../types';
import { RiskConfidenceBadge } from './RiskConfidenceBadge';
import { ExposureBandsCard } from './ExposureBandsCard';
import { RiskLimitsCard } from './RiskLimitsCard';
import { TimeHorizonsCard } from './TimeHorizonsCard';
import { RebalancingCard } from './RebalancingCard';
import { InactionRulesCard } from './InactionRulesCard';
import { ExportButton } from '../ExportButton';

interface RiskProfileResultsProps {
  response: RiskProfileResponse;
  onNewAnalysis: () => void;
}

export function RiskProfileResults({ response, onNewAnalysis }: RiskProfileResultsProps) {
  const { data, meta } = response;
  const exportRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            Personal Risk Framework
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Age {meta.age} • {meta.drawdownTolerance}% max drawdown • {meta.capitalStability} stability • {new Date(meta.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton 
            targetRef={exportRef} 
            filename={`risk-profile-age${meta.age}-${new Date().toISOString().slice(0, 10)}`} 
          />
          <button
            onClick={onNewAnalysis}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            New Plan
          </button>
        </div>
      </div>

      {/* Exportable Content */}
      <div ref={exportRef} className="space-y-4">
        {/* Analysis Cards */}
        <RiskConfidenceBadge level={data.confidence_level} />
        <ExposureBandsCard data={data.exposure_bands} />
        <RiskLimitsCard limits={data.risk_limits} />
        <TimeHorizonsCard data={data.time_horizons} />
        <RebalancingCard logic={data.rebalancing_logic} />
        <InactionRulesCard rules={data.rules_for_inaction} />
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-6">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>⚠️ Important:</strong> This risk framework is for educational purposes only. 
          It does not constitute financial advice. Allocation ranges are general guidelines, not specific recommendations.
          Always consult with a qualified financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  );
}
