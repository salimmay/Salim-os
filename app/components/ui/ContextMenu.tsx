import { RefreshCw, Palette, Code, Settings } from "lucide-react";
import { useSound } from "../contexts/SoundContext";

export const ContextMenu = ({ x, y, onClose, onAction }: any) => {
  const { play } = useSound();

  const handleAction = (action: string) => {
    play('click');
    onAction(action);
  };

  return (
    <>
      <div className="fixed inset-0 z-[90]" onClick={onClose} />
      <div className="fixed z-[95] bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl py-2 min-w-[180px] pointer-events-auto" style={{ left: x, top: y }}>
        <button onClick={() => handleAction('refresh')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-slate-200 text-sm flex items-center gap-2"><RefreshCw size={14} /> Refresh</button>
        <button onClick={() => handleAction('wallpaper')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-slate-200 text-sm flex items-center gap-2"><Palette size={14} /> Change Wallpaper</button>
        <div className="h-px bg-white/10 my-1" />
        <button onClick={() => handleAction('vscode')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-slate-200 text-sm flex items-center gap-2"><Code size={14} /> Open VS Code</button>
        <div className="h-px bg-white/10 my-1" />
        <button onClick={() => handleAction('properties')} className="w-full text-left px-4 py-2 hover:bg-white/10 text-slate-200 text-sm flex items-center gap-2"><Settings size={14} /> Properties</button>
      </div>
    </>
  );
};
