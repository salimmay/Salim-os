"use client";

import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { useSound } from "../contexts/SoundContext";
import { useAchievements } from "../contexts/AchievementsContext";

export const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const boardSize = 20;
  const dirRef = useRef({ x: 1, y: 0 });
  const { play } = useSound();
  const { unlock } = useAchievements();

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = setInterval(() => {
      setSnake((prev) => {
        const currentDir = dirRef.current;
        const newHead = { x: prev[0].x + currentDir.x, y: prev[0].y + currentDir.y };

        if (newHead.x < 0 || newHead.x >= boardSize || newHead.y < 0 || newHead.y >= boardSize || prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          play('error');
          return prev;
        }

        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 1);
          play('success');
          if (score + 1 >= 10) unlock('snake_master', 'Snake Master - Score 10+');
          setFood({ x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 150);

    return () => clearInterval(moveSnake);
  }, [gameStarted, gameOver, food, boardSize, score, play, unlock]);

  const handleDir = (x: number, y: number) => {
    const current = dirRef.current;
    if ((x !== 0 && current.x === 0) || (y !== 0 && current.y === 0)) {
      setDir({ x, y });
      dirRef.current = { x, y };
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === "ArrowUp") handleDir(0, -1);
      if (e.key === "ArrowDown") handleDir(0, 1);
      if (e.key === "ArrowLeft") handleDir(-1, 0);
      if (e.key === "ArrowRight") handleDir(1, 0);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDir({ x: 1, y: 0 });
    dirRef.current = { x: 1, y: 0 };
    setGameOver(false);
    setScore(0);
    setGameStarted(true);
    play('click');
  };

  return (
    <div className="h-full bg-slate-950 flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden">
      <div className="mb-4 text-center z-20">
        <h3 className="text-green-500 text-xl font-bold tracking-widest">SNAKE.EXE</h3>
        <div className="text-slate-400 text-sm mt-2">SCORE: <span className="text-white">{score}</span></div>
      </div>
      <div className="relative border-4 border-slate-700 bg-black/80 p-1 rounded-lg shadow-2xl z-20">
        <div className="grid bg-slate-900/50" style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)`, width: "min(70vw, 400px)", height: "min(70vw, 400px)" }}>
          {Array.from({ length: boardSize * boardSize }).map((_, i) => {
            const x = i % boardSize;
            const y = Math.floor(i / boardSize);
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            return <div key={i} className={`${isSnake ? "bg-green-600/80" : isFood ? "bg-red-500 rounded-full" : "border-[0.5px] border-white/5"}`} />;
          })}
        </div>
        {(!gameStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-30">
            {gameOver && <div className="text-red-500 font-bold text-2xl mb-2">GAME OVER</div>}
            <button onClick={resetGame} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 cursor-pointer"><Play size={18} /> {gameOver ? "RETRY" : "START"}</button>
          </div>
        )}
      </div>
      <div className="mt-4 text-slate-500 text-xs">Use arrow keys to move</div>
    </div>
  );
};
