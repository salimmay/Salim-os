"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { useSound } from "../contexts/SoundContext";

export const Window = ({ 
  id, 
  title, 
  icon: Icon, 
  children, 
  onClose, 
  onMinimize,
  onMaximize,
  isOpen, 
  isMinimized,
  isMaximized,
  isActive, 
  onClick 
}: any) => {
  const { play } = useSound();
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);

  if (!isOpen || isMinimized) return null;

  const handleWindowMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from title bar
    const target = e.target as HTMLElement;
    if (target.closest('.window-titlebar')) {
      setIsDraggingWindow(true);
    }
    onClick();
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className={`fixed flex flex-col overflow-hidden shadow-2xl border border-slate-700/50 backdrop-blur-xl bg-slate-900/95 ${
        isActive ? "z-50 ring-2 ring-blue-500/50" : "z-40"
      } rounded-lg pointer-events-auto`}
      style={
        isMaximized
          ? {
              top: 40,
              left: 0,
              width: '100%',
              height: 'calc(100vh - 120px)',
              borderRadius: 0,
            }
          : {
              top: 80,
              left: 100,
              width: 'min(90vw, 800px)',
              height: '600px',
            }
      }
      drag={!isMaximized && !isDraggingWindow}
      dragMomentum={false}
      dragConstraints={{ top: 40, left: 0, right: window.innerWidth - 400, bottom: window.innerHeight - 200 }}
      dragElastic={0}
      onMouseDown={handleWindowMouseDown}
      onDragEnd={() => setIsDraggingWindow(false)}
    >
      <div className="window-titlebar h-10 bg-slate-800/90 flex items-center justify-between px-4 border-b border-slate-700/50 shrink-0 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onClose(id); 
              play('click'); 
            }}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer flex items-center justify-center group transition-colors"
          >
            <X size={8} className="opacity-0 group-hover:opacity-100 text-black transition-opacity" />
          </button>
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onMinimize(id); 
              play('click'); 
            }}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer flex items-center justify-center group transition-colors"
          >
            <Minus size={8} className="opacity-0 group-hover:opacity-100 text-black transition-opacity" />
          </button>
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              onMaximize(id); 
              play('click'); 
            }}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer flex items-center justify-center group transition-colors"
          >
            {isMaximized ? (
              <Minimize2 size={8} className="opacity-0 group-hover:opacity-100 text-black transition-opacity" />
            ) : (
              <Maximize2 size={8} className="opacity-0 group-hover:opacity-100 text-black transition-opacity" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 text-slate-300 text-sm font-medium pointer-events-none">
          <Icon size={14} /> <span>{title}</span>
        </div>
        <div className="w-20" />
      </div>
      <div className="flex-1 overflow-hidden relative">{children}</div>
    </motion.div>
  );
};
