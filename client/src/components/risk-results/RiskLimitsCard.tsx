/**
 * Risk Limits Card
 */

import { ShieldAlert } from 'lucide-react';

interface RiskLimitsCardProps {
  limits: string[];
}

export function RiskLimitsCard({ limits }: RiskLimitsCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">Risk Limits & Guardrails</h3>
      </div>
      
      <ul className="space-y-2">
        {limits.map((limit, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-error mt-0.5 font-bold">•</span>
            {limit}
          </li>
        ))}
      </ul>
    </div>
  );
}
