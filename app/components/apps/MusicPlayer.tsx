"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Music, ChevronRight, Play } from "lucide-react";
import { useSound } from "../contexts/SoundContext";

export const MusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { play } = useSound();

  const togglePlay = () => {
    if (playing) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
      play('success');
    }
    setPlaying(!playing);
  };

  return (
    <div className="h-full bg-slate-900 flex flex-col p-6 text-white relative overflow-hidden">
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-purple-500/10 blur-[100px] pointer-events-none animate-pulse" />
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" />
      <div className="flex items-center justify-center flex-1 relative z-10">
        <div className={`relative w-40 h-40 rounded-full bg-black border-4 border-slate-800 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-1000 ${playing ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
          <div className="absolute inset-2 rounded-full border border-slate-800 opacity-50"></div>
          <div className="absolute inset-4 rounded-full border border-slate-800 opacity-50"></div>
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"><Music size={20} className="text-white" /></div>
        </div>
      </div>
      <div className="space-y-4 z-10 mt-4">
        <div className="text-center"><h3 className="font-bold text-xl tracking-tight">Lofi Coding Beats</h3><p className="text-slate-400 text-xs uppercase tracking-widest">Salim FM • 98.5</p></div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" animate={{ width: playing ? ["0%", "100%"] : "0%" }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }} /></div>
        <div className="flex justify-center gap-8 items-center">
          <button className="text-slate-500 hover:text-white"><ChevronRight className="rotate-180" /></button>
          <button onClick={togglePlay} className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl hover:shadow-white/20">
            {playing ? <div className="flex gap-1 h-4 items-center"><div className="w-1 h-4 bg-black animate-[bounce_1s_infinite]" /><div className="w-1 h-6 bg-black animate-[bounce_1s_infinite_0.2s]" /><div className="w-1 h-4 bg-black animate-[bounce_1s_infinite_0.4s]" /></div> : <Play size={24} className="ml-1 fill-black" />}
          </button>
          <button className="text-slate-500 hover:text-white"><ChevronRight /></button>
        </div>
      </div>
    </div>
  );
};
