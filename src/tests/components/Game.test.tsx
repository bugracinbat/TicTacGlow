import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Game from './Game';

describe('Game Component', () => {
  beforeEach(() => {
    render(<Game />);
  });

  it('renders initial game state correctly', () => {
    expect(screen.getByText(/Next player/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(9); // 9 squares
  });

  it('updates game state when squares are clicked', () => {
    const squares = screen.getAllByRole('button');
    
    // First move
    fireEvent.click(squares[0]);
    expect(squares[0]).toHaveTextContent('X');
    expect(screen.getByText(/Next player: O/i)).toBeInTheDocument();
    
    // Second move
    fireEvent.click(squares[4]);
    expect(squares[4]).toHaveTextContent('O');
    expect(screen.getByText(/Next player: X/i)).toBeInTheDocument();
  });

  it('detects a winner correctly', () => {
    const squares = screen.getAllByRole('button');
    
    // X wins with top row
    fireEvent.click(squares[0]); // X
    fireEvent.click(squares[3]); // O
    fireEvent.click(squares[1]); // X
    fireEvent.click(squares[4]); // O
    fireEvent.click(squares[2]); // X
    
    expect(screen.getByText(/Winner: X/i)).toBeInTheDocument();
  });

  it('allows game restart', () => {
    const squares = screen.getAllByRole('button');
    
    // Make some moves
    fireEvent.click(squares[0]);
    fireEvent.click(squares[1]);
    
    // Find and click restart button
    const restartButton = screen.getByText(/Play Again/i);
    fireEvent.click(restartButton);
    
    // Check if game state is reset
    const newSquares = screen.getAllByRole('button');
    newSquares.forEach(square => {
      expect(square).toHaveTextContent('');
    });
    expect(screen.getByText(/Next player: X/i)).toBeInTheDocument();
  });

  it('updates score when game ends', () => {
    const squares = screen.getAllByRole('button');
    
    // X wins
    fireEvent.click(squares[0]); // X
    fireEvent.click(squares[3]); // O
    fireEvent.click(squares[1]); // X
    fireEvent.click(squares[4]); // O
    fireEvent.click(squares[2]); // X
    
    expect(screen.getByText(/X Wins: 1/i)).toBeInTheDocument();
  });
}); 