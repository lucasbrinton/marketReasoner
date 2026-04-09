import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { MarketAnalysis } from '../../types';
import { AnalysisCard } from '../shared';

interface FinancialHealthCardProps {
  data: MarketAnalysis['financial_health'];
}

export function FinancialHealthCard({ data }: FinancialHealthCardProps) {
  return (
    <AnalysisCard icon={DollarSign} title="Financial Health">
      <p className="text-text-secondary mb-4">{data.summary}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">Strengths</span>
          </div>
          <ul className="space-y-2">
            {data.strengths.map((strength, idx) => (
              <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-success mt-0.5">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-warning">Weaknesses</span>
          </div>
          <ul className="space-y-2">
            {data.weaknesses.map((weakness, idx) => (
              <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
                <span className="text-warning mt-0.5">•</span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AnalysisCard>
  );
}
