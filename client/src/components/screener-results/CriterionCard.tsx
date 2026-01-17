/**
 * Criterion Card - Shows pass/fail badge and explanation
 */

import { CheckCircle2, XCircle } from 'lucide-react';

interface CriterionCardProps {
  label: string;
  pass: boolean;
  explanation: string;
}

export function CriterionCard({ label, pass, explanation }: CriterionCardProps) {
  return (
    <div className={`card border-l-4 ${pass ? 'border-l-success' : 'border-l-error'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded-full ${pass ? 'bg-success/10' : 'bg-error/10'}`}>
          {pass ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <XCircle className="w-5 h-5 text-error" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-text-primary">{label}</h4>
            <span className={`badge ${pass ? 'badge-success' : 'badge-error'}`}>
              {pass ? 'PASS' : 'FAIL'}
            </span>
          </div>
          <p className="text-sm text-text-secondary">{explanation}</p>
        </div>
      </div>
    </div>
  );
}
