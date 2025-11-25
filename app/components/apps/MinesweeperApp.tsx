"use client";

import React, { useState, useEffect } from "react";
import { Bug, Flag, Smile, Frown, Trophy, RefreshCw } from "lucide-react";
import { useSound } from "../contexts/SoundContext";
import { useToast } from "../contexts/ToastContext";

export const MinesweeperApp = () => {
  const ROWS = 10;
  const COLS = 10;
  const MINES = 15;

  interface Cell {
    isMine: boolean;
    isOpen: boolean;
    isFlagged: boolean;
    count: number;
  }

  const [grid, setGrid] = useState<Cell[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const { play } = useSound();
  const { addToast } = useToast();

  // Initialize Board
  const initGame = () => {
    // 1. Create Empty Grid
    let newGrid: Cell[] = Array(ROWS * COLS).fill(null).map(() => ({
      isMine: false,
      isOpen: false,
      isFlagged: false,
      count: 0,
    }));

    // 2. Place Mines
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const idx = Math.floor(Math.random() * (ROWS * COLS));
      if (!newGrid[idx].isMine) {
        newGrid[idx].isMine = true;
        minesPlaced++;
      }
    }

    // 3. Calculate Numbers
    for (let i = 0; i < newGrid.length; i++) {
      if (newGrid[i].isMine) continue;
      const neighbors = getNeighbors(i);
      let count = 0;
      neighbors.forEach(n => { if (newGrid[n].isMine) count++; });
      newGrid[i].count = count;
    }

    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setFlagCount(MINES);
    play('click');
  };

  useEffect(() => { initGame(); }, []);

  const getNeighbors = (index: number) => {
    const neighbors = [];
    const x = index % COLS;
    const y = Math.floor(index / COLS);
    
    // Check all 8 directions
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) {
          neighbors.push(ny * COLS + nx);
        }
      }
    }
    return neighbors;
  };

  const revealCell = (index: number, currentGrid: Cell[]) => {
    if (currentGrid[index].isOpen || currentGrid[index].isFlagged) return;
    
    currentGrid[index].isOpen = true;

    // If empty cell, flood fill
    if (currentGrid[index].count === 0 && !currentGrid[index].isMine) {
      const neighbors = getNeighbors(index);
      neighbors.forEach(n => revealCell(n, currentGrid));
    }
  };

  const handleLeftClick = (index: number) => {
    if (gameOver || win || grid[index].isOpen || grid[index].isFlagged) return;

    const newGrid = [...grid];
    
    // Hit Mine
    if (newGrid[index].isMine) {
      newGrid[index].isOpen = true;
      // Reveal all mines
      newGrid.forEach(c => { if(c.isMine) c.isOpen = true; });
      setGrid(newGrid);
      setGameOver(true);
      play('error');
      addToast("System integrity compromised! 💥", 'error');
      return;
    }

    // Safe Click
    revealCell(index, newGrid);
    setGrid(newGrid);
    play('click');

    // Check Win
    const openCount = newGrid.filter(c => c.isOpen).length;
    if (openCount === (ROWS * COLS) - MINES) {
      setWin(true);
      play('success');
      addToast("System De-bugged Successfully! 🏆", 'success');
    }
  };

  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    if (gameOver || win || grid[index].isOpen) return;
    
    const newGrid = [...grid];
    if (!newGrid[index].isFlagged && flagCount === 0) return; // No flags left

    newGrid[index].isFlagged = !newGrid[index].isFlagged;
    setGrid(newGrid);
    setFlagCount(prev => newGrid[index].isFlagged ? prev - 1 : prev + 1);
    play('click');
  };

  // Number colors mapping
  const getNumColor = (num: number) => {
    const colors = [
      '', 'text-blue-400', 'text-green-400', 'text-red-400', 'text-purple-400', 
      'text-yellow-400', 'text-pink-400', 'text-white'
    ];
    return colors[num] || 'text-white';
  };

  return (
    <div className="h-full bg-slate-900 p-4 flex flex-col items-center select-none">
      {/* Header Bar */}
      <div className="w-full max-w-[320px] bg-slate-800 border-2 border-slate-600 p-2 mb-4 flex justify-between items-center rounded shadow-lg">
        <div className="bg-black px-3 py-1 text-red-500 font-mono font-bold text-xl border border-slate-600 rounded">
          {String(flagCount).padStart(3, '0')}
        </div>
        
        <button 
          onClick={initGame}
          className="w-10 h-10 bg-slate-700 border-2 border-t-slate-600 border-l-slate-600 border-b-black border-r-black active:border-t-black active:border-l-black flex items-center justify-center hover:bg-slate-600"
        >
          {gameOver ? <Frown className="text-red-400" /> : win ? <Trophy className="text-yellow-400" /> : <Smile className="text-yellow-400" />}
        </button>

        <div className="bg-black px-3 py-1 text-red-500 font-mono font-bold text-xl border border-slate-600 rounded">
          {win ? "WIN" : gameOver ? "ERR" : "000"}
        </div>
      </div>

      {/* The Grid */}
      <div 
        className="bg-slate-800 border-4 border-slate-700 p-1 shadow-2xl"
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 30px)`,
          gap: '2px'
        }}
      >
        {grid.map((cell, i) => (
          <div
            key={i}
            onClick={() => handleLeftClick(i)}
            onContextMenu={(e) => handleRightClick(e, i)}
            className={`
              w-[30px] h-[30px] flex items-center justify-center text-base font-bold cursor-pointer
              ${cell.isOpen 
                ? (cell.isMine ? "bg-red-500" : "bg-slate-800 border border-slate-700/50") 
                : "bg-slate-600 hover:bg-slate-500 border-t-2 border-l-2 border-white/20 border-b-2 border-r-2 border-black/40 active:border-none"
              }
            `}
          >
            {cell.isOpen && !cell.isMine && cell.count > 0 && (
              <span className={getNumColor(cell.count)}>{cell.count}</span>
            )}
            {cell.isOpen && cell.isMine && <Bug size={18} className="text-black animate-pulse fill-black"/>}
            {!cell.isOpen && cell.isFlagged && <Flag size={16} className="text-red-500 fill-red-500"/>}
          </div>
        ))}
      </div>

      <div className="mt-4 text-slate-500 text-xs font-mono">
        DEBUG MODE: Find all bugs 🐛
      </div>
    </div>
  );
};