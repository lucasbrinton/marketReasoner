/**
 * Long Term Impact Card
 */

import { TrendingUp, Signal, Eye } from 'lucide-react';
import { NewsAnalysis } from '../../types';

interface LongTermImpactCardProps {
  data: NewsAnalysis['long_term_impact'];
}

export function LongTermImpactCard({ data }: LongTermImpactCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">Long-Term Impact</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Signal vs Noise */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Signal className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-text-primary">Signal vs Noise</span>
          </div>
          <p className="text-sm text-text-secondary">{data.signal_vs_noise}</p>
        </div>
        
        {/* Contrarian Risks */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-text-primary">Contrarian Perspective</span>
          </div>
          <p className="text-sm text-text-secondary">{data.contrarian_risks}</p>
        </div>
      </div>
    </div>
  );
}
