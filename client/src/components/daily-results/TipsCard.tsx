import { Lightbulb } from 'lucide-react';
import { AnalysisCard } from '../shared';

interface TipsCardProps {
  tips: string[];
}

export function TipsCard({ tips }: TipsCardProps) {
  return (
    <AnalysisCard icon={Lightbulb} title="Tips for Consistency" iconClassName="text-success" className="border-l-4 border-l-success">
      <ul className="space-y-2">
        {tips.map((tip, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-success font-bold">✓</span>
            {tip}
          </li>
        ))}
      </ul>
    </AnalysisCard>
  );
}
