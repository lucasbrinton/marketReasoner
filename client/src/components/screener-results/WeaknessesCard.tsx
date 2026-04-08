import { AlertTriangle } from 'lucide-react';
import { AnalysisCard } from '../shared';

interface WeaknessesCardProps {
  weaknesses: string[];
}

export function WeaknessesCard({ weaknesses }: WeaknessesCardProps) {
  return (
    <AnalysisCard icon={AlertTriangle} title="Key Weaknesses" subtitle="(Areas of concern)" iconClassName="text-amber-500" className="border-l-4 border-l-amber-500">
      <ul className="space-y-2">
        {weaknesses.map((weakness, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-amber-500 mt-0.5 font-bold">⚠</span>
            {weakness}
          </li>
        ))}
      </ul>
    </AnalysisCard>
  );
}
