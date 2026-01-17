/**
 * Time Horizons Card
 */

import { Clock, Calendar, CalendarRange } from 'lucide-react';
import { RiskProfile } from '../../types';

interface TimeHorizonsCardProps {
  data: RiskProfile['time_horizons'];
}

export function TimeHorizonsCard({ data }: TimeHorizonsCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">Time Horizon Guidance</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Short Term */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-text-primary">Short-Term</span>
            <span className="text-xs text-text-muted">(0-2 years)</span>
          </div>
          <p className="text-sm text-text-secondary">{data.short}</p>
        </div>
        
        {/* Medium Term */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-text-primary">Medium-Term</span>
            <span className="text-xs text-text-muted">(2-10 years)</span>
          </div>
          <p className="text-sm text-text-secondary">{data.medium}</p>
        </div>
        
        {/* Long Term */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CalendarRange className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-text-primary">Long-Term</span>
            <span className="text-xs text-text-muted">(10+ years)</span>
          </div>
          <p className="text-sm text-text-secondary">{data.long}</p>
        </div>
      </div>
    </div>
  );
}
