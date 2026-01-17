/**
 * Rules for Inaction Card
 */

import { PauseCircle } from 'lucide-react';

interface InactionRulesCardProps {
  rules: string[];
}

export function InactionRulesCard({ rules }: InactionRulesCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <PauseCircle className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">When NOT to Act</h3>
        <span className="text-xs text-text-muted">(Rules for Inaction)</span>
      </div>
      
      <ul className="space-y-2">
        {rules.map((rule, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-amber-500 mt-0.5 font-bold">⏸</span>
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}
