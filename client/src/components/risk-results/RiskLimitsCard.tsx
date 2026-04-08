import { ShieldAlert } from 'lucide-react';
import { AnalysisCard } from '../shared';

interface RiskLimitsCardProps {
  limits: string[];
}

export function RiskLimitsCard({ limits }: RiskLimitsCardProps) {
  return (
    <AnalysisCard icon={ShieldAlert} title="Risk Limits & Guardrails">
      <ul className="space-y-2">
        {limits.map((limit, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-error mt-0.5 font-bold">•</span>
            {limit}
          </li>
        ))}
      </ul>
    </AnalysisCard>
  );
}
