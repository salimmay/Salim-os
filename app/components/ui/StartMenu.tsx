"use client";

import { motion } from "framer-motion";
import { Music, Palette, Gamepad2, BrainCircuit, Code, Cpu, FileCode, AlertTriangle,Bomb  } from "lucide-react";
import { useSound } from "../contexts/SoundContext";

export const StartMenu = ({ isOpen, onOpenWindow, toggleStart }: any) => {
  const { play } = useSound();

  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 20, opacity: 0 }}
      className="absolute bottom-16 left-4 w-64 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 flex flex-col pointer-events-auto"
    >
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full overflow-hidden"><img src="/me.jpg" alt="SM" className="w-full h-full object-cover" /></div>
        <div><div className="font-bold">Salim May</div><div className="text-xs opacity-80">Administrator</div></div>
      </div>
      <div className="p-2 space-y-1">
        <button onClick={() => { onOpenWindow('music'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-slate-200 text-sm flex items-center gap-3"><div className="p-1 bg-pink-500 rounded"><Music size={14} className="text-white" /></div> Salim FM</button>
        <button onClick={() => { onOpenWindow('paint'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-slate-200 text-sm flex items-center gap-3"><div className="p-1 bg-orange-500 rounded"><Palette size={14} className="text-white" /></div> Paint.exe</button>
        <button onClick={() => { onOpenWindow('game'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-slate-200 text-sm flex items-center gap-3"><div className="p-1 bg-emerald-500 rounded"><Gamepad2 size={14} className="text-white" /></div> Snake Game</button>
        <button onClick={() => { onOpenWindow('interests'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-slate-200 text-sm flex items-center gap-3"><div className="p-1 bg-teal-500 rounded"><BrainCircuit size={14} className="text-white" /></div> Brain.exe</button>
        <div className="h-px bg-white/10 my-1" />
        <button onClick={() => { onOpenWindow('calc'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-slate-200 text-sm flex items-center gap-3"><div className="p-1 bg-gray-500 rounded"><Code size={14} className="text-white" /></div> Calculator</button>
        <button onClick={() => { onOpenWindow('calendar'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-slate-200 text-sm flex items-center gap-3"><div className="p-1 bg-blue-500 rounded"><Cpu size={14} className="text-white" /></div> Calendar</button>
        <button onClick={() => { onOpenWindow('notepad'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-slate-200 text-sm flex items-center gap-3"><div className="p-1 bg-yellow-500 rounded"><FileCode size={14} className="text-black" /></div> Notepad</button>
        <button onClick={() => { onOpenWindow('minesweeper'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded text-slate-200 text-sm flex items-center gap-3"><div className="p-1 bg-red-600 rounded"><Bomb size={14} className="text-white"/></div>Minesweeper</button>
        <div className="h-px bg-white/10 my-1" />
        <button onClick={() => { onOpenWindow('bsod'); toggleStart(); play('click'); }} className="w-full text-left px-3 py-2 hover:bg-red-500/20 rounded text-red-400 text-sm flex items-center gap-3 group"><AlertTriangle size={16} className="group-hover:animate-bounce" /> Self Destruct</button>
      </div>
      <div className="p-2 bg-slate-950 border-t border-slate-800 flex justify-between">
        <button className="text-xs text-slate-400 hover:text-white px-2 py-1">Settings</button>
        <button onClick={() => window.location.reload()} className="text-xs text-slate-400 hover:text-white px-2 py-1">Shut Down</button>
      </div>
    </motion.div>
  );
};
