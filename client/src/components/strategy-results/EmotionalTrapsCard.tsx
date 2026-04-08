import { Brain } from 'lucide-react';
import { AnalysisCard } from '../shared';

interface EmotionalTrapsCardProps {
  traps: string[];
}

export function EmotionalTrapsCard({ traps }: EmotionalTrapsCardProps) {
  return (
    <AnalysisCard icon={Brain} title="Emotional Traps" subtitle="(Psychological pitfalls)" iconClassName="text-purple-500">
      <ul className="space-y-2">
        {traps.map((trap, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-purple-500 mt-0.5">🧠</span>
            {trap}
          </li>
        ))}
      </ul>
    </AnalysisCard>
  );
}
