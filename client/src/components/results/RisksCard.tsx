import { AlertTriangle, Clock, Calendar, HelpCircle } from 'lucide-react';
import { MarketAnalysis } from '../../types';
import { AnalysisCard } from '../shared';

interface RisksCardProps {
  data: MarketAnalysis['risks'];
}

export function RisksCard({ data }: RisksCardProps) {
  return (
    <AnalysisCard icon={AlertTriangle} title="Risk Assessment">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Short-term Risks */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-error" />
            <span className="text-sm font-medium text-text-primary">Short-Term</span>
            <span className="text-xs text-text-muted">(0-12 mo)</span>
          </div>
          <ul className="space-y-2">
            {data.short_term.map((risk, idx) => (
              <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-error mt-0.5">•</span>
                {risk}
              </li>
            ))}
          </ul>
        </div>

        {/* Long-term Risks */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-text-primary">Long-Term</span>
            <span className="text-xs text-text-muted">(12+ mo)</span>
          </div>
          <ul className="space-y-2">
            {data.long_term.map((risk, idx) => (
              <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-warning mt-0.5">•</span>
                {risk}
              </li>
            ))}
          </ul>
        </div>

        {/* Unknowns */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-text-muted" />
            <span className="text-sm font-medium text-text-primary">Unknowns</span>
          </div>
          <ul className="space-y-2">
            {data.unknowns.map((unknown, idx) => (
              <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-text-muted mt-0.5">?</span>
                {unknown}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AnalysisCard>
  );
}
