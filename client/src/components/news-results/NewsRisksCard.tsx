import { AlertTriangle } from 'lucide-react';
import { AnalysisCard } from '../shared';

interface NewsRisksCardProps {
  risks: string[];
}

export function NewsRisksCard({ risks }: NewsRisksCardProps) {
  return (
    <AnalysisCard icon={AlertTriangle} title="Risks & Uncertainties">
      <ul className="space-y-2">
        {risks.map((risk, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-error mt-0.5">•</span>
            {risk}
          </li>
        ))}
      </ul>
    </AnalysisCard>
  );
}
