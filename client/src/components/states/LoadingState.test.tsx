/**
 * AnalysisLoadingState Component Tests
 *
 * Tests the loading state displayed during AI processing.
 * Validates UX elements for both simple (no steps) and stepped variants.
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Brain, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { AnalysisLoadingState } from './AnalysisLoadingState';

describe('AnalysisLoadingState (simple variant)', () => {
  it('displays the title text', () => {
    render(
      <AnalysisLoadingState
        icon={Brain}
        title="Analyzing AAPL..."
        subtitle="Reasoning with AI — this may take 8–15 seconds. Evaluating business model, financial health, competitive position, and risks."
      />
    );

    expect(screen.getByText(/Analyzing AAPL/i)).toBeInTheDocument();
  });

  it('shows expected wait time messaging for AI processing', () => {
    render(
      <AnalysisLoadingState
        icon={Brain}
        title="Analyzing MSFT..."
        subtitle="Reasoning with AI — this may take 8–15 seconds. Evaluating business model, financial health, competitive position, and risks."
      />
    );

    expect(screen.getByText(/8–15 seconds/i)).toBeInTheDocument();
    expect(screen.getByText(/Reasoning with AI/i)).toBeInTheDocument();
  });

  it('displays explanation of what AI is evaluating', () => {
    render(
      <AnalysisLoadingState
        icon={Brain}
        title="Analyzing NVDA..."
        subtitle="Reasoning with AI — this may take 8–15 seconds. Evaluating business model, financial health, competitive position, and risks."
      />
    );

    expect(screen.getByText(/business model/i)).toBeInTheDocument();
    expect(screen.getByText(/financial health/i)).toBeInTheDocument();
    expect(screen.getByText(/competitive position/i)).toBeInTheDocument();
    expect(screen.getByText(/risks/i)).toBeInTheDocument();
  });

  it('renders loading animation elements', () => {
    const { container } = render(
      <AnalysisLoadingState
        icon={Brain}
        title="Analyzing AAPL..."
        subtitle="Reasoning with AI — this may take 8–15 seconds."
      />
    );

    // Check for animated elements
    const pulsingDots = container.querySelectorAll('.animate-pulse');
    expect(pulsingDots.length).toBeGreaterThan(0);
  });
});

describe('AnalysisLoadingState (steps variant)', () => {
  it('renders step labels when steps are provided', () => {
    render(
      <AnalysisLoadingState
        icon={Shield}
        title="Building Your Risk Framework"
        subtitle="Creating a personalized risk management plan..."
        steps={[
          { icon: Shield, label: 'Analyzing risk tolerance...' },
          { icon: TrendingUp, label: 'Calculating exposure bands...' },
          { icon: AlertTriangle, label: 'Setting risk limits...' },
        ]}
      />
    );

    expect(screen.getByText('Analyzing risk tolerance...')).toBeInTheDocument();
    expect(screen.getByText('Calculating exposure bands...')).toBeInTheDocument();
    expect(screen.getByText('Setting risk limits...')).toBeInTheDocument();
  });
});
