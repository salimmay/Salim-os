"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, X, Folder, FileCode, Lock, ChevronRight } from "lucide-react";
import { FILE_SYSTEM } from "../constants/data";
import { useSound } from "../contexts/SoundContext";
import { useAchievements } from "../contexts/AchievementsContext";

export const FileExplorer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [currentPath, setCurrentPath] = useState(['root']);
  const [unlockedFolders, setUnlockedFolders] = useState<Set<string>>(new Set());
  const { play } = useSound();
  const { unlock } = useAchievements();

  const getCurrentFolder = () => {
    let current: any = FILE_SYSTEM;
    currentPath.forEach(key => {
      if (current && current.children) {
        current = current.children[key];
      }
    });
    return current;
  };

  const navigateTo = (key: string, item: any) => {
    play('click');
    
    if (item.type === 'file') {
      alert(`File: ${item.name}\nContent: ${item.content}`);
      return;
    }

    if (item.locked && !unlockedFolders.has(key)) {
      const password = prompt('This folder is locked. Enter password:');
      if (password === 'open sesame') {
        setUnlockedFolders(prev => new Set([...prev, key]));
        unlock('hacker', 'Master Hacker - Unlocked Secret Folder');
        setCurrentPath(prev => [...prev, key]);
      } else {
        play('error');
        alert('Incorrect password!');
      }
      return;
    }

    setCurrentPath(prev => [...prev, key]);
  };

  const goBack = () => {
    if (currentPath.length > 1) {
      play('click');
      setCurrentPath(prev => prev.slice(0, -1));
    }
  };

  const currentFolder = getCurrentFolder();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl z-[100] pointer-events-auto flex flex-col"
    >
      <div className="p-4 border-b border-slate-700 flex items-center gap-2">
        <button onClick={goBack} disabled={currentPath.length === 1} className="p-1 rounded hover:bg-slate-800 disabled:opacity-30">
          <ArrowLeft size={16} className="text-white" />
        </button>
        <div className="text-white font-bold text-sm">
          {currentPath.map((key, i) => (
            <span key={i}>
              {i > 0 && ' > '}
              {(FILE_SYSTEM.root.children as any)[key]?.name || key}
            </span>
          ))}
        </div>
        <button onClick={onClose} className="ml-auto p-1 rounded hover:bg-slate-800">
          <X size={16} className="text-white" />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        {currentFolder.children && Object.entries(currentFolder.children).map(([key, item]: [string, any]) => (
          <div
            key={key}
            onClick={() => navigateTo(key, item)}
            className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded cursor-pointer group"
          >
            {item.type === 'folder' ? (
              <Folder size={20} className={item.locked && !unlockedFolders.has(key) ? "text-red-400" : "text-blue-400"} />
            ) : (
              <FileCode size={20} className="text-green-400" />
            )}
            <div className="flex-1">
              <div className="text-white text-sm">{item.name}</div>
              {item.locked && !unlockedFolders.has(key) && (
                <div className="text-red-400 text-xs flex items-center gap-1">
                  <Lock size={10} />
                  Locked
                </div>
              )}
            </div>
            {item.type === 'folder' && (
              <ChevronRight size={16} className="text-slate-400 group-hover:text-white" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
