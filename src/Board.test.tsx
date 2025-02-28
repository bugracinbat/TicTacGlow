import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Board from './Board';

describe('Board Component', () => {
  const mockSquares = Array(9).fill(null);
  const mockOnPlay = vi.fn();
  const mockXIsNext = true;

  it('renders 9 squares', () => {
    render(
      <Board squares={mockSquares} xIsNext={mockXIsNext} onPlay={mockOnPlay} />
    );
    const squares = screen.getAllByRole('button');
    expect(squares).toHaveLength(9);
  });

  it('handles square clicks correctly', () => {
    render(
      <Board squares={mockSquares} xIsNext={mockXIsNext} onPlay={mockOnPlay} />
    );
    
    const firstSquare = screen.getAllByRole('button')[0];
    fireEvent.click(firstSquare);
    
    expect(mockOnPlay).toHaveBeenCalledWith(expect.arrayContaining([
      'X', null, null,
      null, null, null,
      null, null, null,
    ]));
  });

  it('displays the correct player symbols', () => {
    const squares = [
      'X', null, 'O',
      null, 'X', null,
      'O', null, null,
    ];
    
    render(
      <Board squares={squares} xIsNext={mockXIsNext} onPlay={mockOnPlay} />
    );
    
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('X');
    expect(buttons[2]).toHaveTextContent('O');
    expect(buttons[4]).toHaveTextContent('X');
    expect(buttons[6]).toHaveTextContent('O');
  });
}); 