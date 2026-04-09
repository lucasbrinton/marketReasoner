import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Brain, Info, ListOrdered, Clock, Lightbulb, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateRoutine } from '../api/client';
import { saveDailyResult } from '../utils/storage';
import { useAnalysis } from '../hooks/useAnalysis';
import { AnalysisLoadingState } from '../components/states/AnalysisLoadingState';
import { DailyRoutineResults } from '../components/daily-results/DailyRoutineResults';
import type { DailyRoutineResponse } from '../types';
import { DailyRoutineRequestSchema, type DailyRoutineRequest } from '../types';

export function DailyPage() {
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors }
  } = useForm<DailyRoutineRequest>({
    resolver: zodResolver(DailyRoutineRequestSchema),
    defaultValues: { preferences: '' }
  });

  const saveFn = useCallback((request: DailyRoutineRequest, response: DailyRoutineResponse) => {
    saveDailyResult(request, response);
    toast.success('Daily routine generated!');
  }, []);

  const { state, submit, reset } = useAnalysis(generateRoutine, saveFn);

  const onSubmit = (data: DailyRoutineRequest) => {
    submit({ preferences: data.preferences?.trim() });
  };

  const handleNewRoutine = () => {
    resetForm();
    reset();
  };

  // Show results if available
  if (state.status === 'success') {
    return (
      <div className="space-y-6">
        <DailyRoutineResults response={state.response} onNewRoutine={handleNewRoutine} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
          <Brain className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Daily Market Brain
        </h1>
        <p className="text-text-secondary">
          Generate a simple, habit-forming daily routine for market awareness
        </p>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card bg-accent/5 border-accent/20"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent mt-0.5" />
          <div className="text-sm text-text-secondary">
            <p className="font-medium text-text-primary mb-1">What You'll Get</p>
            <ul className="space-y-1 list-disc pl-4">
              <li><strong>5-7 actionable steps</strong> for daily market review</li>
              <li><strong>Time estimate</strong> (typically under 15 minutes)</li>
              <li><strong>Consistency tips</strong> to build lasting habits</li>
              <li><strong>Common pitfalls</strong> to avoid</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Input Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit(onSubmit)}
        className="card"
      >
        <label htmlFor="preferences" className="block text-sm font-medium text-text-primary mb-2">
          Preferences (Optional)
        </label>
        <textarea
          id="preferences"
          placeholder="e.g., Focus on tech stocks, prefer morning routine, interested in options..."
          className="input w-full h-24 resize-none"
          disabled={state.status === 'loading'}
          maxLength={500}
          {...register('preferences')}
        />
        {errors.preferences && (
          <p className="text-sm text-error mt-1">{errors.preferences.message}</p>
        )}
        <p className="text-xs text-text-muted mt-2">
          Leave blank for a general routine, or describe your focus areas
        </p>

        <button
          type="submit"
          disabled={state.status === 'loading'}
          className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2"
        >
          <Brain className="w-4 h-4" />
          Generate Daily Routine
        </button>
      </motion.form>

      {/* Loading State */}
      {state.status === 'loading' && (
        <AnalysisLoadingState
          icon={Brain}
          title="Generating Your Daily Routine"
          subtitle="Building a habit-forming routine... (8-15s)"
          steps={[
            { icon: Brain, label: 'Analyzing market habits...' },
            { icon: ListOrdered, label: 'Structuring routine steps...' },
            { icon: Clock, label: 'Optimizing time allocation...' },
            { icon: Lightbulb, label: 'Generating consistency tips...' },
            { icon: AlertTriangle, label: 'Identifying common pitfalls...' },
          ]}
        />
      )}

      {/* Error State */}
      {state.status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card border-error bg-error/5"
        >
          <p className="text-sm text-error">{state.message}</p>
          <button
            onClick={handleNewRoutine}
            className="btn btn-secondary mt-4"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Philosophy Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-xs text-text-muted space-y-2"
      >
        <p>
          🧠 <strong>Philosophy:</strong> This routine focuses on <em>observation</em> and <em>awareness</em>,
          not trading decisions.
        </p>
        <p>
          The goal is to build a sustainable habit of staying informed, not to generate trades.
        </p>
      </motion.div>
    </div>
  );
}
