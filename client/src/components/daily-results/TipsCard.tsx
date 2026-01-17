/**
 * Tips for Consistency Card
 */

import { Lightbulb } from 'lucide-react';

interface TipsCardProps {
  tips: string[];
}

export function TipsCard({ tips }: TipsCardProps) {
  return (
    <div className="card border-l-4 border-l-success">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-success" />
        <h3 className="font-semibold text-text-primary">Tips for Consistency</h3>
      </div>
      
      <ul className="space-y-2">
        {tips.map((tip, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-success font-bold">✓</span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
