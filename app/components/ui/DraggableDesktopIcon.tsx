"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSound } from "../contexts/SoundContext";

export const DraggableDesktopIcon = ({ icon: Icon, label, onClick, color, defaultPosition }: any) => {
  const [position, setPosition] = useState(defaultPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(1);
  const { play } = useSound();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setZIndex(1000);
    play('click');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: position.x + e.movementX,
      y: position.y + e.movementY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <motion.div
      className={`group flex flex-col items-center gap-1 w-20 cursor-pointer absolute pointer-events-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ 
        left: position.x, 
        ...(position.y < 0 ? { bottom: Math.abs(position.y) } : { top: position.y }),
        zIndex 
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      drag={false}
    >
      <div 
        className={`w-12 h-12 ${color} rounded-xl shadow-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform ${isDragging ? 'scale-110' : ''}`}
        onClick={(e) => {
          if (!isDragging) {
            onClick();
            play('click');
          }
        }}
      >
        <Icon size={24} />
      </div>
      <span className="text-white text-xs font-medium drop-shadow-md bg-black/40 px-2 rounded-full border border-white/10">
        {label}
      </span>
    </motion.div>
  );
};
