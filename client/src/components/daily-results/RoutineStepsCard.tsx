/**
 * Routine Steps Card - Shows numbered steps
 */

import { ListOrdered, CheckSquare } from 'lucide-react';
import { RoutineSteps } from '../../types';

interface RoutineStepsCardProps {
  steps: RoutineSteps;
}

export function RoutineStepsCard({ steps }: RoutineStepsCardProps) {
  // Convert steps object to array
  const stepArray = Object.entries(steps)
    .filter(([_, value]) => value) // Remove undefined/empty steps
    .sort(([a], [b]) => a.localeCompare(b)) // Sort by step number
    .map(([key, value]) => ({
      number: parseInt(key.replace('step', '')),
      description: value as string
    }));

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <ListOrdered className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-text-primary">Daily Routine Steps</h3>
        <span className="text-xs text-text-muted">({stepArray.length} steps)</span>
      </div>
      
      <div className="space-y-3">
        {stepArray.map((step) => (
          <div 
            key={step.number}
            className="flex items-start gap-3 p-3 bg-surface-alt rounded-lg border border-border"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-accent/10 text-accent rounded-full flex items-center justify-center font-bold text-sm">
              {step.number}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm text-text-primary">{step.description}</p>
            </div>
            <CheckSquare className="w-4 h-4 text-text-muted flex-shrink-0 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
