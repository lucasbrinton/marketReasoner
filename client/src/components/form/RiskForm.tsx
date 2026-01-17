/**
 * Risk Form Component
 * 
 * Collects investor profile: age, goals, drawdown tolerance, capital stability
 */

import { useState } from 'react';
import { Shield, User, Target, TrendingDown, Wallet } from 'lucide-react';
import { RiskProfileRequest, CAPITAL_STABILITY_OPTIONS } from '../../types';

interface RiskFormProps {
  onSubmit: (data: RiskProfileRequest) => void;
  isLoading: boolean;
}

export function RiskForm({ onSubmit, isLoading }: RiskFormProps) {
  const [age, setAge] = useState<number>(35);
  const [goals, setGoals] = useState('');
  const [drawdownTolerance, setDrawdownTolerance] = useState<number>(20);
  const [capitalStability, setCapitalStability] = useState<RiskProfileRequest['capitalStability']>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ age, goals, drawdownTolerance, capitalStability });
  };

  const isValid = age > 0 && age < 120 && goals.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold text-text-primary">Your Risk Profile</h2>
      </div>

      {/* Age Input */}
      <div>
        <label className="form-label flex items-center gap-2">
          <User className="w-4 h-4" />
          Age
        </label>
        <input
          type="number"
          min={18}
          max={100}
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value) || 0)}
          className="input w-full"
          placeholder="Enter your age"
          disabled={isLoading}
        />
        <p className="text-xs text-text-muted mt-1">
          Your age affects time horizon and risk capacity
        </p>
      </div>

      {/* Investment Goals */}
      <div>
        <label className="form-label flex items-center gap-2">
          <Target className="w-4 h-4" />
          Investment Goals
        </label>
        <textarea
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          className="input w-full min-h-[100px] resize-y"
          placeholder="e.g., Retire at 60 with $2M portfolio, fund children's education, preserve capital..."
          disabled={isLoading}
        />
        <p className="text-xs text-text-muted mt-1">
          Describe your investment objectives and timeline
        </p>
      </div>

      {/* Drawdown Tolerance Slider */}
      <div>
        <label className="form-label flex items-center gap-2">
          <TrendingDown className="w-4 h-4" />
          Maximum Drawdown Tolerance: <span className="text-accent font-semibold">{drawdownTolerance}%</span>
        </label>
        <input
          type="range"
          min={5}
          max={50}
          step={5}
          value={drawdownTolerance}
          onChange={(e) => setDrawdownTolerance(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent"
          disabled={isLoading}
        />
        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>Conservative (5%)</span>
          <span>Moderate (25%)</span>
          <span>Aggressive (50%)</span>
        </div>
        <p className="text-xs text-text-muted mt-2">
          How much loss can you tolerate before making changes?
        </p>
      </div>

      {/* Capital Stability Select */}
      <div>
        <label className="form-label flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          Capital Stability Needs
        </label>
        <select
          value={capitalStability}
          onChange={(e) => setCapitalStability(e.target.value as RiskProfileRequest['capitalStability'])}
          className="input w-full"
          disabled={isLoading}
        >
          {CAPITAL_STABILITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-text-muted mt-1">
          How important is protecting your principal?
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="btn btn-primary w-full"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Analyzing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Generate Risk Framework
          </span>
        )}
      </button>
    </form>
  );
}
