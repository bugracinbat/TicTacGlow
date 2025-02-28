import React, { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { calculateWinner, isBoardFull } from '../utils/gameUtils';
import Board from './Board';
import Confetti from './Confetti';
import '../styles/App.css';

interface Score {
  x: number;
  o: number;
  ties: number;
}

interface PlayerNames {
  x: string;
  o: string;
}

type GameMode = 'pvp' | 'ai-easy' | 'ai-medium' | 'ai-hard';
type Theme = 'default' | 'neon' | 'retro' | 'cosmic';

const Game: React.FC = () => {
  const {
    history,
    currentMove,
    score,
    xIsNext,
    currentSquares,
    handlePlay,
    resetGame,
    jumpTo,
  } = useGameState();

  const winner = calculateWinner(currentSquares);
  const gameOver = winner || isBoardFull(currentSquares);

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isBoardFull(currentSquares)) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  const moves = history.map((step, move) => {
    const description = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <h1 className="game-title">TicTacGlow</h1>
      
      <div className="score-board">
        <div className="score-item">
          <span className="score-label">X Wins:</span>
          <span className="score-value">{score.x}</span>
        </div>
        <div className="score-item">
          <span className="score-label">O Wins:</span>
          <span className="score-value">{score.o}</span>
        </div>
        <div className="score-item">
          <span className="score-label">Ties:</span>
          <span className="score-value">{score.ties}</span>
        </div>
      </div>

      <div className="game-content">
        <div className="game-info">
          <div className="status">{status}</div>
          {gameOver && (
            <button className="play-again" onClick={resetGame}>
              Play Again
            </button>
          )}
        </div>

        <Board
          squares={currentSquares}
          xIsNext={xIsNext}
          onPlay={handlePlay}
        />

        <div className="game-history">
          <ol>{moves}</ol>
        </div>
      </div>

      {winner && <Confetti />}
    </div>
  );
};

export default Game; 