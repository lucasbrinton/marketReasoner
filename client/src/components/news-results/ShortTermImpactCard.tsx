/**
 * Short Term Impact Card
 */

import { Zap, Heart, Briefcase } from 'lucide-react';
import { NewsAnalysis } from '../../types';

interface ShortTermImpactCardProps {
  data: NewsAnalysis['short_term_impact'];
}

export function ShortTermImpactCard({ data }: ShortTermImpactCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">Short-Term Impact</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Emotional Reaction */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-error" />
            <span className="text-sm font-medium text-text-primary">Emotional Market Reaction</span>
          </div>
          <p className="text-sm text-text-secondary">{data.emotional}</p>
        </div>
        
        {/* Business Relevance */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-text-primary">Actual Business Relevance</span>
          </div>
          <p className="text-sm text-text-secondary">{data.business_relevance}</p>
        </div>
      </div>
    </div>
  );
}
