/**
 * ErrorState Component Tests
 *
 * Tests error handling UI for failed AI requests.
 * Validates user-friendly error messaging and retry functionality.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  const mockOnRetry = vi.fn();

  beforeEach(() => {
    mockOnRetry.mockClear();
  });

  it('displays the error message', () => {
    render(<ErrorState message="Network error - please check your connection" onRetry={mockOnRetry} />);

    expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    expect(screen.getByText(/please check your connection/i)).toBeInTheDocument();
  });

  it('shows Analysis Failed heading', () => {
    render(<ErrorState message="API rate limit exceeded" onRetry={mockOnRetry} />);

    expect(screen.getByText(/Analysis Failed/i)).toBeInTheDocument();
  });

  it('renders a retry button', () => {
    render(<ErrorState message="Timeout" onRetry={mockOnRetry} />);

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();

    render(<ErrorState message="Server error" onRetry={mockOnRetry} />);

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('displays different error messages correctly', () => {
    const { rerender } = render(
      <ErrorState message="Invalid ticker symbol" onRetry={mockOnRetry} />
    );

    expect(screen.getByText(/Invalid ticker symbol/i)).toBeInTheDocument();

    rerender(<ErrorState message="AI service unavailable" onRetry={mockOnRetry} />);

    expect(screen.getByText(/AI service unavailable/i)).toBeInTheDocument();
  });
});
