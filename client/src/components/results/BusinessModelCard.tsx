import { Building2 } from 'lucide-react';
import { AnalysisCard } from '../shared';

interface BusinessModelCardProps {
  content: string;
}

export function BusinessModelCard({ content }: BusinessModelCardProps) {
  return (
    <AnalysisCard icon={Building2} title="Business Model">
      <p className="text-text-secondary leading-relaxed">{content}</p>
    </AnalysisCard>
  );
}
