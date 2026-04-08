import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  AnalysisRequest,
  AnalysisRequestSchema,
  AVAILABLE_TICKERS,
  HORIZON_OPTIONS,
  STYLE_OPTIONS
} from '../../types';

interface AnalysisFormProps {
  onSubmit: (data: AnalysisRequest) => void;
  isLoading: boolean;
}

export function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AnalysisRequest>({
    resolver: zodResolver(AnalysisRequestSchema),
    defaultValues: {
      ticker: 'AAPL',
      horizon: 'long',
      style: 'growth'
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Analyze Stock</h2>
        <p className="text-sm text-text-secondary mt-1">
          Select a ticker and analysis parameters to get AI-powered market insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ticker Input */}
        <div>
          <label htmlFor="ticker" className="block text-sm font-medium text-text-primary mb-1.5">
            Ticker Symbol
          </label>
          <input
            id="ticker"
            type="text"
            placeholder="AAPL"
            list="ticker-options"
            className="w-full uppercase"
            disabled={isLoading}
            {...register('ticker')}
          />
          <datalist id="ticker-options">
            {AVAILABLE_TICKERS.map(t => (
              <option key={t} value={t} />
            ))}
          </datalist>
          {errors.ticker && (
            <p className="text-sm text-error mt-1">{errors.ticker.message}</p>
          )}
          <p className="text-xs text-text-muted mt-1">
            Available: {AVAILABLE_TICKERS.join(', ')}
          </p>
        </div>

        {/* Horizon Select */}
        <div>
          <label htmlFor="horizon" className="block text-sm font-medium text-text-primary mb-1.5">
            Investment Horizon
          </label>
          <select
            id="horizon"
            className="w-full"
            disabled={isLoading}
            {...register('horizon')}
          >
            {HORIZON_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.horizon && (
            <p className="text-sm text-error mt-1">{errors.horizon.message}</p>
          )}
        </div>

        {/* Style Select */}
        <div>
          <label htmlFor="style" className="block text-sm font-medium text-text-primary mb-1.5">
            Investment Style
          </label>
          <select
            id="style"
            className="w-full"
            disabled={isLoading}
            {...register('style')}
          >
            {STYLE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.style && (
            <p className="text-sm text-error mt-1">{errors.style.message}</p>
          )}
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
              <Loader2 className="w-4 h-4 spinner" />
              Analyzing...
            </>
          ) : (
            'Run Analysis'
          )}
        </button>
      </div>
    </form>
  );
}
