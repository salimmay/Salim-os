"use client";

import { X } from "lucide-react";
import { useSound } from "../contexts/SoundContext";

export const DockIcon = ({ 
  icon: Icon, 
  isOpen, 
  isMinimized,
  onClick, 
  onClose,
  label 
}: any) => {
  const { play } = useSound();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
    play('click');
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    play('click');
  };

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        className={`relative p-2.5 rounded-lg hover:-translate-y-2 transition-all shrink-0 ${
          isOpen && !isMinimized 
            ? 'bg-slate-700/80' 
            : 'bg-slate-800/80 hover:bg-slate-700'
        }`}
      >
        <Icon className="text-white" size={24} />
        {isOpen && (
          <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
            isMinimized ? 'bg-yellow-400' : 'bg-blue-400'
          }`} />
        )}
      </button>
      {isOpen && (
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
        >
          <X size={12} className="text-white" />
        </button>
      )}
      {/* Tooltip */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-700">
        {label}
      </div>
    </div>
  );
};
