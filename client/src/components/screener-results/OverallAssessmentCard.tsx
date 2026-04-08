import { FileText } from 'lucide-react';
import { AnalysisCard } from '../shared';

interface OverallAssessmentCardProps {
  assessment: string;
}

export function OverallAssessmentCard({ assessment }: OverallAssessmentCardProps) {
  return (
    <AnalysisCard icon={FileText} title="Overall Assessment">
      <p className="text-sm text-text-secondary">{assessment}</p>
    </AnalysisCard>
  );
}
