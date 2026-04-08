import { AlertTriangle } from 'lucide-react';
import { AnalysisCard } from '../shared';

interface PitfallsCardProps {
  pitfalls: string[];
}

export function PitfallsCard({ pitfalls }: PitfallsCardProps) {
  return (
    <AnalysisCard icon={AlertTriangle} title="Potential Pitfalls" iconClassName="text-amber-500" className="border-l-4 border-l-amber-500">
      <ul className="space-y-2">
        {pitfalls.map((pitfall, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-amber-500 font-bold">⚠</span>
            {pitfall}
          </li>
        ))}
      </ul>
    </AnalysisCard>
  );
}
