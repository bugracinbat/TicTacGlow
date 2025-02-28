import React, { useState, useEffect } from 'react';
import Board from './Board';
import Confetti from './Confetti';

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
  const [squares, setSquares] = useState(Array(9).fill(''));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState<Score>({ x: 0, o: 0, ties: 0 });
  const [gameHistory, setGameHistory] = useState<string[][]>([]);
  const [scoreChange, setScoreChange] = useState<'x' | 'o' | 'ties' | null>(null);
  const [playerNames, setPlayerNames] = useState<PlayerNames>(() => {
    const savedNames = localStorage.getItem('playerNames');
    return savedNames ? JSON.parse(savedNames) : { x: 'Player X', o: 'Player O' };
  });
  const [isEditingNames, setIsEditingNames] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [theme, setTheme] = useState<Theme>('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  // Load audio files
  const moveSound = new Audio('/sounds/move.mp3');
  const winSound = new Audio('/sounds/win.mp3');
  const drawSound = new Audio('/sounds/draw.mp3');

  const playSound = (sound: HTMLAudioElement) => {
    if (soundEnabled) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  };

  // AI move calculation
  const calculateAIMove = (board: string[], difficulty: 'easy' | 'medium' | 'hard'): number => {
    const availableMoves = board.map((square, index) => square === '' ? index : -1).filter(i => i !== -1);
    
    if (difficulty === 'easy') {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    if (difficulty === 'medium') {
      // 70% chance of making the best move
      if (Math.random() > 0.3) {
        return getBestMove(board, 'O');
      }
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    // Hard difficulty - always make the best move
    return getBestMove(board, 'O');
  };

  const getBestMove = (board: string[], player: string): number => {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = player;
        const score = minimax(board, 0, false);
        board[i] = '';
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  const minimax = (board: string[], depth: number, isMaximizing: boolean): number => {
    const winner = calculateWinner(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (board.every(square => square !== '')) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
          board[i] = '';
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
          board[i] = '';
        }
      }
      return bestScore;
    }
  };

  const calculateWinnerWithLine = (squares: string[]): { winner: string | null; line: number[] | null } => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return { winner: null, line: null };
  };

  const handleNameChange = (player: 'x' | 'o', name: string) => {
    setPlayerNames(prev => ({
      ...prev,
      [player]: name || `Player ${player.toUpperCase()}`
    }));
  };

  const handleClick = (i: number) => {
    const squaresCopy = squares.slice();
    if (calculateWinnerWithLine(squaresCopy).winner || squaresCopy[i] || (!isXNext && gameMode !== 'pvp')) {
      return;
    }
    squaresCopy[i] = isXNext ? 'X' : 'O';
    setSquares(squaresCopy);
    setIsXNext(!isXNext);
    playSound(moveSound);

    const { winner, line } = calculateWinnerWithLine(squaresCopy);
    if (winner) {
      setWinningLine(line);
      setShowConfetti(true);
    }
  };

  useEffect(() => {
    if (!isXNext && gameMode !== 'pvp' && !calculateWinnerWithLine(squares).winner && !squares.every(square => square !== '')) {
      const difficulty = gameMode.split('-')[1] as 'easy' | 'medium' | 'hard';
      const aiMove = calculateAIMove(squares, difficulty);
      
      setTimeout(() => {
        const newSquares = squares.slice();
        newSquares[aiMove] = 'O';
        setSquares(newSquares);
        setIsXNext(true);
        playSound(moveSound);

        const { winner, line } = calculateWinnerWithLine(newSquares);
        if (winner) {
          setWinningLine(line);
          setShowConfetti(true);
        }
      }, 500);
    }
  }, [isXNext, gameMode, squares]);

  useEffect(() => {
    localStorage.setItem('playerNames', JSON.stringify(playerNames));
  }, [playerNames]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handlePlayAgain = () => {
    setSquares(Array(9).fill(''));
    setIsXNext(true);
    setWinningLine(null);
    setShowConfetti(false);
  };

  const handleResetScores = () => {
    setScores({ x: 0, o: 0, ties: 0 });
    setGameHistory([]);
    handlePlayAgain();
  };

  const { winner } = calculateWinnerWithLine(squares);
  const isDraw = !winner && squares.every(square => square !== '');

  let status;
  if (winner) {
    status = `Winner: ${winner === 'X' ? playerNames.x : playerNames.o}`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${isXNext ? playerNames.x : playerNames.o}`;
  }

  return (
    <div className={`game theme-${theme}`}>
      <Confetti isActive={showConfetti} />
      <h1 className="game-title">Tic Tac Toe</h1>
      
      <div className="game-controls">
        <select 
          value={gameMode} 
          onChange={(e) => setGameMode(e.target.value as GameMode)}
          className="mode-select"
        >
          <option value="pvp">Player vs Player</option>
          <option value="ai-easy">AI - Easy</option>
          <option value="ai-medium">AI - Medium</option>
          <option value="ai-hard">AI - Hard</option>
        </select>

        <select 
          value={theme} 
          onChange={(e) => setTheme(e.target.value as Theme)}
          className="theme-select"
        >
          <option value="default">Default Theme</option>
          <option value="neon">Neon</option>
          <option value="retro">Retro</option>
          <option value="cosmic">Cosmic</option>
        </select>

        <button 
          className="sound-toggle"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
        </button>
      </div>

      <div className="game-stats">
        <div className="score-board">
          <div className="score-item">
            {isEditingNames ? (
              <input
                type="text"
                value={playerNames.x}
                onChange={(e) => handleNameChange('x', e.target.value)}
                className="player-name-input"
                maxLength={15}
                placeholder="Player X"
              />
            ) : (
              <span className="player-x">{playerNames.x}</span>
            )}
            <span className={`score ${scoreChange === 'x' ? 'score-change' : ''}`}>
              {scores.x}
            </span>
          </div>
          <div className="score-item">
            {isEditingNames ? (
              <input
                type="text"
                value={playerNames.o}
                onChange={(e) => handleNameChange('o', e.target.value)}
                className="player-name-input"
                maxLength={15}
                placeholder="Player O"
              />
            ) : (
              <span className="player-o">{playerNames.o}</span>
            )}
            <span className={`score ${scoreChange === 'o' ? 'score-change' : ''}`}>
              {scores.o}
            </span>
          </div>
          <div className="score-item">
            <span className="ties">Ties</span>
            <span className={`score ${scoreChange === 'ties' ? 'score-change' : ''}`}>
              {scores.ties}
            </span>
          </div>
        </div>
        <button 
          className="edit-names-btn"
          onClick={() => setIsEditingNames(!isEditingNames)}
        >
          {isEditingNames ? 'Save Names' : 'Edit Names'}
        </button>
      </div>
      
      <div className="game-board">
        <Board 
          squares={squares} 
          onClick={handleClick} 
          winningLine={winningLine}
        />
      </div>
      
      <div className="game-info">
        <div className="status">{status}</div>
        <div className="button-container">
          {(winner || isDraw) && (
            <button className="play-again-btn" onClick={handlePlayAgain}>
              Play Again
            </button>
          )}
          <button className="reset-btn" onClick={handleResetScores}>
            Reset Scores
          </button>
        </div>
      </div>

      <div className="game-history">
        <h2>Game History</h2>
        <div className="history-list">
          {gameHistory.map((game, index) => (
            <div key={index} className="history-item">
              Game {index + 1}: {calculateWinner(game) ? `Winner: ${calculateWinner(game)}` : 'Draw'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function calculateWinner(squares: string[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game; 