/**
 * News Risks & Uncertainties Card
 */

import { AlertTriangle } from 'lucide-react';

interface NewsRisksCardProps {
  risks: string[];
}

export function NewsRisksCard({ risks }: NewsRisksCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">Risks & Uncertainties</h3>
      </div>
      
      <ul className="space-y-2">
        {risks.map((risk, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-error mt-0.5">•</span>
            {risk}
          </li>
        ))}
      </ul>
    </div>
  );
}
