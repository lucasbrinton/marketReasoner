/**
 * Time Allocation Card
 */

import { Clock } from 'lucide-react';

interface TimeAllocationCardProps {
  timeAllocation: string;
}

export function TimeAllocationCard({ timeAllocation }: TimeAllocationCardProps) {
  return (
    <div className="card bg-accent/5 border-accent/20">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Clock className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-text-muted">Total Time Required</h4>
          <p className="text-lg font-semibold text-text-primary">{timeAllocation}</p>
        </div>
      </div>
    </div>
  );
}
