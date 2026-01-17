/**
 * News Analysis Form Component
 * 
 * Form for submitting news impact analysis requests.
 * Uses React Hook Form + Zod for validation.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { NewsAnalysisRequest, NewsAnalysisRequestSchema } from '../../types';

interface NewsFormProps {
  onSubmit: (data: NewsAnalysisRequest) => void;
  isLoading: boolean;
}

// Example news for testing
const EXAMPLE_NEWS = `Apple Inc. announced today that it has reached a preliminary agreement with the European Union regarding its App Store policies. The agreement, if finalized, would allow alternative payment systems for iOS apps in the EU while maintaining Apple's core security requirements. Analysts estimate this could reduce App Store revenue in Europe by 5-8% but may prevent billions in potential fines. Apple shares rose 2% on the news.`;

export function NewsForm({ onSubmit, isLoading }: NewsFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<NewsAnalysisRequest>({
    resolver: zodResolver(NewsAnalysisRequestSchema),
    defaultValues: {
      newsText: '',
      stockOrSector: ''
    }
  });

  const handleLoadExample = () => {
    setValue('newsText', EXAMPLE_NEWS);
    setValue('stockOrSector', 'Apple (AAPL)');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Analyze News Impact</h2>
        <p className="text-sm text-text-secondary mt-1">
          Paste a news article and specify the stock or sector to understand potential market impact.
        </p>
      </div>

      <div className="space-y-4">
        {/* Stock/Sector Input */}
        <div>
          <label htmlFor="stockOrSector" className="block text-sm font-medium text-text-primary mb-1.5">
            Stock or Sector
          </label>
          <input
            id="stockOrSector"
            type="text"
            placeholder="e.g., Apple (AAPL) or Tech Sector"
            className="w-full"
            disabled={isLoading}
            {...register('stockOrSector')}
          />
          {errors.stockOrSector && (
            <p className="text-sm text-error mt-1">{errors.stockOrSector.message}</p>
          )}
        </div>

        {/* News Text Area */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="newsText" className="block text-sm font-medium text-text-primary">
              News Article
            </label>
            <button
              type="button"
              onClick={handleLoadExample}
              className="text-xs text-accent hover:underline"
              disabled={isLoading}
            >
              Load Example
            </button>
          </div>
          <textarea
            id="newsText"
            placeholder="Paste the news article or press release here..."
            className="w-full min-h-[200px] resize-y"
            disabled={isLoading}
            {...register('newsText')}
          />
          {errors.newsText && (
            <p className="text-sm text-error mt-1">{errors.newsText.message}</p>
          )}
          <p className="text-xs text-text-muted mt-1">
            Min 20 characters, max 10,000 characters
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full md:w-auto flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze News Impact'
          )}
        </button>
      </div>
    </form>
  );
}
