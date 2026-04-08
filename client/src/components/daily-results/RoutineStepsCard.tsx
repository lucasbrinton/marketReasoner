import { ListOrdered, CheckSquare } from 'lucide-react';
import { RoutineSteps } from '../../types';
import { AnalysisCard } from '../shared';

interface RoutineStepsCardProps {
  steps: RoutineSteps;
}

export function RoutineStepsCard({ steps }: RoutineStepsCardProps) {
  const stepArray = Object.entries(steps)
    .filter(([, value]) => value)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({
      number: parseInt(key.replace('step', '')),
      description: value as string,
    }));

  return (
    <AnalysisCard icon={ListOrdered} title="Daily Routine Steps" subtitle={`(${stepArray.length} steps)`}>
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
    </AnalysisCard>
  );
}
