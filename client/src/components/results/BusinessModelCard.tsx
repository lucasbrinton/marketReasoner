/**
 * Business Model Card
 */

import { Building2 } from 'lucide-react';

interface BusinessModelCardProps {
  content: string;
}

export function BusinessModelCard({ content }: BusinessModelCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">Business Model</h3>
      </div>
      <p className="text-text-secondary leading-relaxed">{content}</p>
    </div>
  );
}
