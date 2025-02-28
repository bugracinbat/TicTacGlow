export type SquareValue = 'X' | 'O' | null;

export interface SquareProps {
  value: SquareValue;
  onSquareClick: () => void;
}

export interface BoardProps {
  squares: SquareValue[];
  xIsNext: boolean;
  onPlay: (nextSquares: SquareValue[]) => void;
}

export interface Score {
  x: number;
  o: number;
  ties: number;
}

export interface GameHistory {
  squares: SquareValue[];
  position: number;
} 