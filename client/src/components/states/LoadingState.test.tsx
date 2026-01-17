/**
 * LoadingState Component Tests
 *
 * Tests the loading state displayed during AI processing.
 * Validates UX elements that communicate AI response latency.
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('displays the ticker being analyzed', () => {
    render(<LoadingState ticker="AAPL" />);

    expect(screen.getByText(/Analyzing AAPL/i)).toBeInTheDocument();
  });

  it('shows expected wait time messaging for AI processing', () => {
    render(<LoadingState ticker="MSFT" />);

    expect(screen.getByText(/8–15 seconds/i)).toBeInTheDocument();
    expect(screen.getByText(/Reasoning with AI/i)).toBeInTheDocument();
  });

  it('displays explanation of what AI is evaluating', () => {
    render(<LoadingState ticker="NVDA" />);

    expect(screen.getByText(/business model/i)).toBeInTheDocument();
    expect(screen.getByText(/financial health/i)).toBeInTheDocument();
    expect(screen.getByText(/competitive position/i)).toBeInTheDocument();
    expect(screen.getByText(/risks/i)).toBeInTheDocument();
  });

  it('renders loading animation elements', () => {
    const { container } = render(<LoadingState ticker="AAPL" />);

    // Check for animated elements
    const pulsingDots = container.querySelectorAll('.animate-pulse');
    expect(pulsingDots.length).toBeGreaterThan(0);
  });
});
