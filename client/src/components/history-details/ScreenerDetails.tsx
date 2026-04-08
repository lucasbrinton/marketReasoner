import { CheckCircle2, XCircle } from 'lucide-react';
import type { ScreenerHistoryItem } from '../../utils/storage';
import { PASS_FAIL_COLORS } from '../../constants/theme';

interface ScreenerDetailsProps {
  item: ScreenerHistoryItem;
}

export function ScreenerDetails({ item }: ScreenerDetailsProps) {
  const { data } = item.output;

  const criteria = [
    { label: 'Valuation', ...data.valuation },
    { label: 'Growth Prospects', ...data.growth_prospects },
    { label: 'Financial Health', ...data.financial_health },
    { label: 'Competitive Advantage', ...data.competitive_advantage },
    { label: 'Risk Factors', ...data.risk_factors },
  ];

  return (
    <div className="space-y-4">
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
                  criterion.pass ? PASS_FAIL_COLORS.pass : PASS_FAIL_COLORS.fail
                }`}>
                  {criterion.pass ? 'PASS' : 'FAIL'}
                </span>
                <p className="text-xs text-text-muted mt-0.5">{criterion.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-text-primary mb-1">Overall Assessment</h4>
        <p className="text-sm text-text-secondary">{data.overall_assessment}</p>
      </div>

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
