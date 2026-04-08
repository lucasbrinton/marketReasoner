import { ShieldAlert } from 'lucide-react';
import { AnalysisCard } from '../shared';

interface StrategyRiskProfileCardProps {
  profile: string;
}

export function StrategyRiskProfileCard({ profile }: StrategyRiskProfileCardProps) {
  return (
    <AnalysisCard icon={ShieldAlert} title="Risk Profile">
      <p className="text-sm text-text-secondary">{profile}</p>
    </AnalysisCard>
  );
}
