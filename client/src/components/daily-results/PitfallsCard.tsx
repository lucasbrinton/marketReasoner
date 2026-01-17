/**
 * Potential Pitfalls Card
 */

import { AlertTriangle } from 'lucide-react';

interface PitfallsCardProps {
  pitfalls: string[];
}

export function PitfallsCard({ pitfalls }: PitfallsCardProps) {
  return (
    <div className="card border-l-4 border-l-amber-500">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold text-text-primary">Potential Pitfalls</h3>
      </div>
      
      <ul className="space-y-2">
        {pitfalls.map((pitfall, idx) => (
          <li key={idx} className="text-sm text-text-secondary flex items-start gap-2">
            <span className="text-amber-500 font-bold">⚠</span>
            {pitfall}
          </li>
        ))}
      </ul>
    </div>
  );
}
