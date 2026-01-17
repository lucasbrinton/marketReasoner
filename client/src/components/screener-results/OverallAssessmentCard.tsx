/**
 * Overall Assessment Card
 */

import { FileText } from 'lucide-react';

interface OverallAssessmentCardProps {
  assessment: string;
}

export function OverallAssessmentCard({ assessment }: OverallAssessmentCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">Overall Assessment</h3>
      </div>
      
      <p className="text-sm text-text-secondary">{assessment}</p>
    </div>
  );
}
