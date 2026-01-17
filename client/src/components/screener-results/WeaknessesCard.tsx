/**
 * Weaknesses Card
 */

import { AlertTriangle } from 'lucide-react';

interface WeaknessesCardProps {
  weaknesses: string[];
}

export function WeaknessesCard({ weaknesses }: WeaknessesCardProps) {
  return (
    <div className="card border-l-4 border-l-amber-500">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold text-text-primary">Key Weaknesses</h3>
        <span className="text-xs text-text-muted">(Areas of concern)</span>
      </div>
      
      <ul className="space-y-2">
        {weaknesses.map((weakness, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-amber-500 mt-0.5 font-bold">⚠</span>
            {weakness}
          </li>
        ))}
      </ul>
    </div>
  );
}
