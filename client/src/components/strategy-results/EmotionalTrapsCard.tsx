/**
 * Emotional Traps Card
 */

import { Brain } from 'lucide-react';

interface EmotionalTrapsCardProps {
  traps: string[];
}

export function EmotionalTrapsCard({ traps }: EmotionalTrapsCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold text-text-primary">Emotional Traps</h3>
        <span className="text-xs text-text-muted">(Psychological pitfalls)</span>
      </div>
      
      <ul className="space-y-2">
        {traps.map((trap, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-purple-500 mt-0.5">🧠</span>
            {trap}
          </li>
        ))}
      </ul>
    </div>
  );
}
