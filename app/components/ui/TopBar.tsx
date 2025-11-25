"use client";

import { useState, useEffect } from "react";
import { Terminal, Wifi, Folder, BrainCircuit, Zap, Monitor, Volume2, VolumeX } from "lucide-react";
import { WiFiMenu } from "../features/WiFiMenu";
import { FileExplorer } from "../features/FileExplorer";
import { SalimAIChat } from "../features/SalimAIChat";
import { HackerTyperMode } from "../features/HackerTyperMode";
import { CRTShader } from "../utils/CRTShader";
import { useSound } from "../contexts/SoundContext";
import { useAchievements } from "../contexts/AchievementsContext";

export const TopBar = () => {
  const [time, setTime] = useState("");
  const [wifiMenuOpen, setWifiMenuOpen] = useState(false);
  const [retroMode, setRetroMode] = useState(false);
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);
  const [salimAIOpen, setSalimAIOpen] = useState(false);
  const [hackerModeOpen, setHackerModeOpen] = useState(false);
  const { muted, toggleMute, play } = useSound();
  const { unlock } = useAchievements();

  useEffect(() => { 
    const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })), 1000); 
    return () => clearInterval(t); 
  }, []);

  const handleRetroModeToggle = () => {
    setRetroMode(!retroMode);
    play('click');
    if (!retroMode) {
      unlock('retro_gamer', 'Retro Gamer - Enabled CRT Mode');
    }
  };

  const handleHackerModeToggle = () => {
    setHackerModeOpen(!hackerModeOpen);
    play('click');
    if (!hackerModeOpen) {
      unlock('hacker_typer', 'Hacker Typer - Enabled typing mode');
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-10 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl flex items-center justify-between px-6 text-xs font-medium text-white z-50 border-b border-white/10 shadow-lg select-none pointer-events-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Terminal size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SalimOS</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <button onClick={() => setFileExplorerOpen(true)} className="hover:text-blue-400 transition-colors p-1.5 hover:bg-white/5 rounded">
            <Folder size={16} />
          </button>
          <button onClick={() => setSalimAIOpen(true)} className="hover:text-green-400 transition-colors p-1.5 hover:bg-white/5 rounded">
            <BrainCircuit size={16} />
          </button>
          <button onClick={handleHackerModeToggle} className="hover:text-red-400 transition-colors p-1.5 hover:bg-white/5 rounded">
            <Zap size={16} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setWifiMenuOpen(!wifiMenuOpen)} className="hover:text-blue-400 transition-colors p-1.5 hover:bg-white/5 rounded flex items-center gap-1">
            <Wifi size={16} />
          </button>
          <button onClick={handleRetroModeToggle} className={`transition-colors p-1.5 hover:bg-white/5 rounded ${retroMode ? 'text-green-400' : 'hover:text-green-400'}`}>
            <Monitor size={16} />
          </button>
          <button onClick={toggleMute} className="hover:text-yellow-400 transition-colors p-1.5 hover:bg-white/5 rounded">
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="font-mono text-sm">{time}</span>
          </div>
        </div>
      </div>

      <WiFiMenu isOpen={wifiMenuOpen} onClose={() => setWifiMenuOpen(false)} />
      {retroMode && <CRTShader />}
      <FileExplorer isOpen={fileExplorerOpen} onClose={() => setFileExplorerOpen(false)} />
      <SalimAIChat isOpen={salimAIOpen} onClose={() => setSalimAIOpen(false)} />
      <HackerTyperMode isOpen={hackerModeOpen} onClose={() => setHackerModeOpen(false)} />
    </>
  );
};
