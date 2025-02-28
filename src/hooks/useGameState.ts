import { useState, useCallback } from 'react';
import { SquareValue, Score, GameHistory } from '../types/game.types';
import { calculateWinner, isBoardFull } from '../utils/gameUtils';

export const useGameState = () => {
  const [history, setHistory] = useState<GameHistory[]>([{ squares: Array(9).fill(null), position: -1 }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [score, setScore] = useState<Score>({ x: 0, o: 0, ties: 0 });
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  const handlePlay = useCallback((nextSquares: SquareValue[]) => {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, position: -1 }];
    setHistory(nextHistory);
    const nextMove = nextHistory.length - 1;
    setCurrentMove(nextMove);

    const winner = calculateWinner(nextSquares);
    if (winner || isBoardFull(nextSquares)) {
      setScore(prevScore => ({
        x: prevScore.x + (winner === 'X' ? 1 : 0),
        o: prevScore.o + (winner === 'O' ? 1 : 0),
        ties: prevScore.ties + (!winner && isBoardFull(nextSquares) ? 1 : 0),
      }));
    }
  }, [currentMove, history]);

  const resetGame = useCallback(() => {
    setHistory([{ squares: Array(9).fill(null), position: -1 }]);
    setCurrentMove(0);
  }, []);

  const jumpTo = useCallback((move: number) => {
    setCurrentMove(move);
  }, []);

  return {
    history,
    currentMove,
    score,
    xIsNext,
    currentSquares,
    handlePlay,
    resetGame,
    jumpTo,
  };
}; 