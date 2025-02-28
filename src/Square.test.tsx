import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Square from './Square';

describe('Square Component', () => {
  it('renders with the correct value', () => {
    render(<Square value="X" onSquareClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('X');
  });

  it('calls onSquareClick when clicked', () => {
    const mockClick = vi.fn();
    render(<Square value="O" onSquareClick={mockClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockClick).toHaveBeenCalledOnce();
  });

  it('applies correct styling based on value', () => {
    const { rerender } = render(<Square value="X" onSquareClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveClass('square');
    
    rerender(<Square value="O" onSquareClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveClass('square');
  });
}); 