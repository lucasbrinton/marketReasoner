/**
 * News Loading State Component
 * 
 * Displayed while AI news analysis is in progress.
 */

import { Loader2, Newspaper } from 'lucide-react';

interface NewsLoadingStateProps {
  stockOrSector: string;
}

export function NewsLoadingState({ stockOrSector }: NewsLoadingStateProps) {
  return (
    <div className="card">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <Newspaper className="w-16 h-16 text-accent opacity-20" />
          <Loader2 className="w-8 h-8 text-accent spinner absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h3 className="text-lg font-medium text-text-primary mt-6">
          Analyzing news for {stockOrSector}...
        </h3>
        <p className="text-sm text-text-secondary mt-2 text-center max-w-md">
          Reasoning with AI — this may take 8–15 seconds.
          <br />
          <span className="text-text-muted">
            Evaluating market reaction, business relevance, and second-order effects.
          </span>
        </p>
        
        {/* Progress indicators */}
        <div className="flex items-center gap-2 mt-6">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
