/**
 * Error State Component
 * 
 * Displayed when analysis fails.
 */

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="card border-red-200 bg-red-50">
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="w-12 h-12 text-error" />
        <h3 className="text-lg font-medium text-text-primary mt-4">
          Analysis Failed
        </h3>
        <p className="text-sm text-text-secondary mt-2 text-center max-w-md">
          {message}
        </p>
        <button
          onClick={onRetry}
          className="btn btn-secondary mt-6 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
