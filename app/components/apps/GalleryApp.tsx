"use client";

import { useState } from "react";
import { Image, ArrowLeft, ExternalLink, Maximize2 } from "lucide-react";
import { GALLERY_ITEMS } from "../constants/data";
import { useSound } from "../contexts/SoundContext";

export const GalleryApp = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { play } = useSound();

  return (
    <div className="h-full bg-slate-950 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedProject ? (
            <button onClick={() => { setSelectedProject(null); play('click'); }} className="p-2 bg-slate-800 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2 text-xs font-bold">
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div className="p-2 bg-indigo-500/10 rounded-lg"><Image className="text-indigo-400" size={20} /></div>
          )}
          <h2 className="text-lg font-bold text-white truncate max-w-[200px]">{selectedProject ? selectedProject.title : "Creative Gallery"}</h2>
        </div>
        <a href="https://www.behance.net/SalimMaytn" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-white flex items-center gap-1">Behance <ExternalLink size={12} /></a>
      </div>
      <div className="flex-1 overflow-auto custom-scrollbar p-4 bg-slate-950">
        {selectedProject ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black rounded-xl overflow-hidden border border-slate-800 relative">
            <iframe src={selectedProject.link} height="100%" width="100%" allowFullScreen loading="lazy" frameBorder="0" className="w-full h-full"></iframe>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GALLERY_ITEMS.map((cat, i) => (
              <div 
                key={i} 
                onClick={() => { setSelectedProject(cat); play('swoosh'); }} 
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 cursor-pointer bg-slate-900 shadow-lg hover:scale-[1.02] transition-all"
              >
                <img src={cat.image} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                <div className="absolute inset-0 bg-slate-800 -z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-white font-bold text-md mb-1">{cat.title}</h3>
                  <div className="flex items-center gap-2 text-indigo-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 size={12} /> Open Project</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
