/**
 * Strategy Risk Profile Card
 */

import { ShieldAlert } from 'lucide-react';

interface StrategyRiskProfileCardProps {
  profile: string;
}

export function StrategyRiskProfileCard({ profile }: StrategyRiskProfileCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">Risk Profile</h3>
      </div>
      
      <p className="text-sm text-text-secondary">{profile}</p>
    </div>
  );
}
