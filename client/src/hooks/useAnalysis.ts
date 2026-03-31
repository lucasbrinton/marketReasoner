import { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { AnalysisError } from '../api/client';

type AnalysisState<TResponse> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; response: TResponse }
  | { status: 'error'; message: string };

export function useAnalysis<TRequest, TResponse>(
  apiFn: (request: TRequest) => Promise<TResponse>,
  saveFn?: (request: TRequest, response: TResponse) => void
) {
  const [state, setState] = useState<AnalysisState<TResponse>>({ status: 'idle' });
  const abortRef = useRef<AbortController | null>(null);

  const submit = useCallback(async (request: TRequest) => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setState({ status: 'loading' });

    try {
      const response = await apiFn(request);

      // Don't update state if aborted
      if (abortRef.current?.signal.aborted) return;

      setState({ status: 'success', response });
      saveFn?.(request, response);
    } catch (error) {
      if (abortRef.current?.signal.aborted) return;

      const message = error instanceof AnalysisError
        ? error.getUserMessage()
        : 'An unexpected error occurred. Please try again.';
      toast.error(message);
      setState({ status: 'error', message });
    }
  }, [apiFn, saveFn]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ status: 'idle' });
  }, []);

  return { state, submit, reset };
}
