import React from 'react';

interface BoardProps {
  squares: string[];
  onClick: (i: number) => void;
  winningLine: number[] | null;
}

const Board: React.FC<BoardProps> = ({ squares, onClick, winningLine }) => {
  const renderSquare = (i: number) => {
    const isWinning = winningLine?.includes(i);
    return (
      <button
        className={`square ${squares[i].toLowerCase()} ${isWinning ? 'winning-square' : ''}`}
        onClick={() => onClick(i)}
      >
        {squares[i]}
      </button>
    );
  };

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

export default Board; 