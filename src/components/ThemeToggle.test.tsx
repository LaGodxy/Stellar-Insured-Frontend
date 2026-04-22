import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '@/components/ThemeToggle';

// Mock useTheme hook
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
  }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders toggle button', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<ThemeToggle />);

    const button = screen.getByLabelText('Toggle color theme');
    expect(button).toBeInTheDocument();
  });

  it('calls toggleTheme when clicked', async () => {
    const { useTheme } = require('@/hooks/useTheme');
    const toggleTheme = jest.fn();
    useTheme.mockReturnValue({
      theme: 'light',
      toggleTheme,
    });

    const user = userEvent.setup();
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('displays sun icon when in dark mode', () => {
    const { useTheme } = require('@/hooks/useTheme');
    useTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: jest.fn(),
    });

    render(<ThemeToggle />);

    // Should show sun icon to switch to light mode
    const button = screen.getByLabelText('Switch to light mode');
    expect(button).toBeInTheDocument();
  });

  it('displays moon icon when in light mode', () => {
    const { useTheme } = require('@/hooks/useTheme');
    useTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: jest.fn(),
    });

    render(<ThemeToggle />);

    // Should show moon icon to switch to dark mode
    const button = screen.getByLabelText('Switch to dark mode');
    expect(button).toBeInTheDocument();
  });

  it('is keyboard accessible', async () => {
    const { useTheme } = require('@/hooks/useTheme');
    const toggleTheme = jest.fn();
    useTheme.mockReturnValue({
      theme: 'light',
      toggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    button.focus();
    
    expect(document.activeElement).toBe(button);
  });
});
