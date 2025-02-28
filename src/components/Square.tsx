import { SquareProps } from '../types/game.types';
import '../styles/App.css';

export default function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
} 