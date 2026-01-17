/**
 * Unknowns Card
 */

import { HelpCircle } from 'lucide-react';

interface UnknownsCardProps {
  unknowns: string[];
}

export function UnknownsCard({ unknowns }: UnknownsCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold text-text-primary">Unknowns & Uncertainties</h3>
        <span className="text-xs text-text-muted">(Factors that cannot be predicted)</span>
      </div>
      
      <ul className="space-y-2">
        {unknowns.map((unknown, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">?</span>
            {unknown}
          </li>
        ))}
      </ul>
    </div>
  );
}
