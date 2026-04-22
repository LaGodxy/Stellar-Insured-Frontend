import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '@/components/ui/Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders when open', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('closes when overlay is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    const overlay = screen.getByLabelText('Close modal overlay');
    await user.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes when Escape key is pressed', async () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal content</div>
      </Modal>
    );

    await act(async () => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not show close button when showCloseButton is false', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" showCloseButton={false}>
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" description="Modal description">
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.getByText('Modal description')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { container, rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Small Modal" size="sm">
        <div>Content</div>
      </Modal>
    );

    expect(container.querySelector('.max-w-md')).toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={mockOnClose} title="Medium Modal" size="md">
        <div>Content</div>
      </Modal>
    );

    expect(container.querySelector('.max-w-xl')).toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={mockOnClose} title="Large Modal" size="lg">
        <div>Content</div>
      </Modal>
    );

    expect(container.querySelector('.max-w-2xl')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={mockOnClose} title="Accessible Modal">
        <div>Modal content</div>
      </Modal>
    );

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('renders children correctly', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div data-testid="custom-content">Custom Content</div>
        <button>Action Button</button>
      </Modal>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });
});
