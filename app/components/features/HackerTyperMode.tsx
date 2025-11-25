"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { HACKER_CODE } from "../constants/data";
import { useSound } from "../contexts/SoundContext";

export const HackerTyperMode = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [typedCode, setTypedCode] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const { play } = useSound();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      e.preventDefault();
      play('keyboard');
      
      if (typingIndex < HACKER_CODE.length) {
        setTypedCode(prev => prev + HACKER_CODE[typingIndex]);
        setTypingIndex(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, typingIndex, play]);

  const resetTyping = () => {
    setTypedCode("");
    setTypingIndex(0);
    play('click');
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[100] pointer-events-auto flex flex-col"
    >
      <div className="p-4 border-b border-green-800 flex justify-between items-center">
        <div className="text-green-400 font-mono text-sm">HACKER MODE ACTIVE - Type anything...</div>
        <button onClick={onClose} className="text-green-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 font-mono text-green-400 text-sm p-4 overflow-auto whitespace-pre">
        {typedCode}
        <span className="animate-pulse">█</span>
      </div>
      
      <div className="p-4 border-t border-green-800 flex justify-between">
        <div className="text-green-400 text-sm">
          Progress: {Math.round((typingIndex / HACKER_CODE.length) * 100)}%
        </div>
        <button 
          onClick={resetTyping}
          className="text-green-400 hover:text-white text-sm"
        >
          Reset
        </button>
      </div>
    </motion.div>
  );
};
