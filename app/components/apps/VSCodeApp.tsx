"use client";

import { useState } from "react";
import { FileCode } from "lucide-react";
import { PROJECTS } from "../constants/data";
import { useSound } from "../contexts/SoundContext";

export const VSCodeApp = () => {
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);
  const { play } = useSound();

  return (
    <div className="flex h-full text-sm font-mono bg-[#1e1e1e] text-slate-300">
      <div className="hidden md:flex w-48 bg-[#252526] border-r border-[#333] flex-col">
        <div className="p-3 text-xs font-bold text-slate-500 tracking-wider">EXPLORER</div>
        <div className="px-2 pt-2 overflow-auto">
          <div className="pl-3 space-y-1">
            {PROJECTS.map((p) => (
              <div 
                key={p.id} 
                onClick={() => { setActiveProject(p); play('click'); }} 
                className={`flex items-center gap-2 p-1.5 rounded cursor-pointer ${activeProject.id === p.id ? "bg-[#37373d] text-white" : "hover:text-white"}`}
              >
                <FileCode size={16} className={p.file.endsWith("tsx") ? "text-blue-400" : "text-yellow-400"} />
                <span className="truncate">{p.file}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
        <div className="flex bg-[#252526] border-b border-[#333] px-4 py-2 text-white text-xs gap-2">
          <FileCode size={12} className="text-yellow-400" /> {activeProject.file}
        </div>
        <div className="flex-1 p-6 overflow-auto custom-scrollbar">
          <h1 className={`text-2xl font-bold mb-2 ${activeProject.color}`}>{activeProject.name}</h1>
          <div className="text-[#ce9178] whitespace-pre-wrap font-sans leading-relaxed">{activeProject.desc}</div>
          {activeProject.tech && (
            <div className="grid grid-cols-2 gap-2 mt-6 max-w-md">
              {activeProject.tech.map(t => <div key={t} className="bg-[#2d2d2d] p-2 rounded text-xs border border-[#3e3e42]">{t}</div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
