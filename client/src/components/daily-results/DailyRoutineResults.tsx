/**
 * Daily Routine Results Display
 */

import { useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { DailyRoutineResponse } from '../../types';
import { DailyConfidenceBadge } from './DailyConfidenceBadge';
import { RoutineStepsCard } from './RoutineStepsCard';
import { TimeAllocationCard } from './TimeAllocationCard';
import { TipsCard } from './TipsCard';
import { PitfallsCard } from './PitfallsCard';
import { ExportButton } from '../ExportButton';

interface DailyRoutineResultsProps {
  response: DailyRoutineResponse;
  onNewRoutine: () => void;
}

export function DailyRoutineResults({ response, onNewRoutine }: DailyRoutineResultsProps) {
  const { data, meta } = response;
  const exportRef = useRef<HTMLDivElement>(null);

  // Count steps
  const stepCount = Object.entries(data.routine_steps).filter(([_, v]) => v).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            Your Daily Market Routine
          </h2>
          <p className="text-sm text-text-muted mt-1">
            {stepCount} steps • {data.time_allocation} • Generated {new Date(meta.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton 
            targetRef={exportRef} 
            filename={`daily-routine-${new Date().toISOString().slice(0, 10)}`} 
          />
          <button
            onClick={onNewRoutine}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            New Routine
          </button>
        </div>
      </div>

      {/* Exportable Content */}
      <div ref={exportRef} className="space-y-4">
        <DailyConfidenceBadge level={data.confidence_level} timeAllocation={data.time_allocation} />
        
        <RoutineStepsCard steps={data.routine_steps} />
        <TimeAllocationCard timeAllocation={data.time_allocation} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TipsCard tips={data.tips_for_consistency} />
          <PitfallsCard pitfalls={data.potential_pitfalls} />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>💡 Tip:</strong> Consistency beats intensity. Start with the first 3 steps and 
          gradually add more as the routine becomes a habit. The goal is awareness, not trading.
        </p>
      </div>
    </div>
  );
}
