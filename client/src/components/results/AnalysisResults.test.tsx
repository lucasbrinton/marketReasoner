/**
 * AnalysisResults Component Tests
 *
 * Tests the rendering of AI-generated market analysis data.
 * Validates that all structured data from the backend is properly displayed.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { mockAnalysisResponse } from '../../test/mocks';
import { AnalysisResults } from './AnalysisResults';

describe('AnalysisResults', () => {
  const mockOnNewAnalysis = vi.fn();

  it('renders ticker and metadata correctly', () => {
    render(
      <AnalysisResults response={mockAnalysisResponse} onNewAnalysis={mockOnNewAnalysis} />
    );

    expect(screen.getByText(/AAPL Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Long horizon/i)).toBeInTheDocument();
    expect(screen.getByText(/Growth style/i)).toBeInTheDocument();
  });

  it('displays business model summary from AI response', () => {
    render(
      <AnalysisResults response={mockAnalysisResponse} onNewAnalysis={mockOnNewAnalysis} />
    );

    expect(
      screen.getByText(/Consumer electronics and services company/i)
    ).toBeInTheDocument();
  });

  it('renders financial health strengths and weaknesses', () => {
    render(
      <AnalysisResults response={mockAnalysisResponse} onNewAnalysis={mockOnNewAnalysis} />
    );

    // Strengths
    expect(screen.getByText(/Strong cash flow/i)).toBeInTheDocument();
    expect(screen.getByText(/Consistent revenue growth/i)).toBeInTheDocument();

    // Weaknesses
    expect(screen.getByText(/High dependency on iPhone revenue/i)).toBeInTheDocument();
  });

  it('shows competitive moat rating with appropriate styling', () => {
    render(
      <AnalysisResults response={mockAnalysisResponse} onNewAnalysis={mockOnNewAnalysis} />
    );

    // Should show "Strong Moat" badge
    expect(screen.getByText(/Strong Moat/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Powerful brand loyalty and integrated ecosystem/i)
    ).toBeInTheDocument();
  });

  it('categorizes risks correctly (short-term, long-term, unknowns)', () => {
    render(
      <AnalysisResults response={mockAnalysisResponse} onNewAnalysis={mockOnNewAnalysis} />
    );

    // Short-term risks
    expect(screen.getByText(/Supply chain disruptions/i)).toBeInTheDocument();

    // Long-term risks
    expect(screen.getByText(/Regulatory pressure/i)).toBeInTheDocument();

    // Unknowns
    expect(screen.getByText(/AI strategy execution/i)).toBeInTheDocument();
  });

  it('displays confidence level badge', () => {
    render(
      <AnalysisResults response={mockAnalysisResponse} onNewAnalysis={mockOnNewAnalysis} />
    );

    expect(screen.getByText(/High Confidence/i)).toBeInTheDocument();
  });

  it('calls onNewAnalysis when button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <AnalysisResults response={mockAnalysisResponse} onNewAnalysis={mockOnNewAnalysis} />
    );

    const newAnalysisButton = screen.getByRole('button', { name: /new analysis/i });
    await user.click(newAnalysisButton);

    expect(mockOnNewAnalysis).toHaveBeenCalledTimes(1);
  });
});
