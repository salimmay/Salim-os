"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "../contexts/ToastContext";
import { useSound } from "../contexts/SoundContext";
import { useAchievements } from "../contexts/AchievementsContext";

export const InteractiveTerminal = ({ onOpenWindow }: { onOpenWindow: (id: string) => void }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<any[]>([{ type: "output", content: "SalimOS Kernel v1.0.0 initialized..." }]);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();
  const { play } = useSound();
  const { unlock } = useAchievements();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      play('keyboard');
      const cmd = input.trim().toLowerCase();
      const args = cmd.split(" ").slice(1);
      let output: any = null;

      if (cmd === 'help') {
        output = (
          <div className="space-y-2">
            <div>Available commands:</div>
            <div className="grid grid-cols-[120px_1fr] gap-1 text-xs">
              <span className="text-yellow-400">about</span> <span>Who is Salim?</span>
              <span className="text-yellow-400">neofetch</span> <span>System Info</span>
              <span className="text-yellow-400">open [app]</span> <span>Launch app</span>
              <span className="text-red-500">sudo rm -rf /</span> <span className="text-red-400">⚠️ DO NOT USE</span>
            </div>
          </div>
        );
      }
      else if (cmd === 'about') output = "Salim May | Full Stack Dev";
      else if (cmd === 'neofetch') {
        output = (
          <div className="flex gap-4 text-xs font-mono mt-2">
            <div className="space-y-1">
              <div><span className="text-blue-400">salim</span>@<span className="text-blue-400">macbook-pro</span></div>
              <div>-------------------</div>
              <div><span className="text-yellow-400">OS</span>: SalimOS v1.0</div>
              <div><span className="text-yellow-400">Host</span>: Vercel Edge</div>
              <div><span className="text-yellow-400">Kernel</span>: React 18.2.0</div>
              <div><span className="text-yellow-400">Uptime</span>: Forever</div>
            </div>
          </div>
        );
      }
      else if (cmd.startsWith('open')) {
        const app = args[0];
        if (['vscode', 'game', 'gallery','minesweeper', 'bio', 'interests', 'readme', 'music', 'paint'].includes(app)) {
          output = `Opening ${app}...`;
          play('swoosh');
          onOpenWindow(app);
        }
        else output = "App not found.";
      }
      else if (cmd === 'clear') { setHistory([]); setInput(""); return; }
      else if (cmd.startsWith('sudo')) {
        if (args.join(' ') === 'rm -rf /') {
          addToast("⚠️ SYSTEM KERNEL PANIC! Rebooting...", 'error');
          play('error');
          document.body.style.transition = "all 1.5s ease-in-out";
          document.body.style.transform = "scale(0.01) rotate(180deg)";
          document.body.style.opacity = "0";
          setTimeout(() => { window.location.reload(); }, 1500);
          return;
        }
        output = <span className="text-red-500">Permission denied.</span>;
      }
      else output = `Command not found: ${cmd}`;

      setHistory([...history, { type: "command", content: input }, { type: "output", content: output }]);
      setInput("");
    }
  };

  return (
    <div className="h-full bg-[#1e1e1e] p-4 font-mono text-sm overflow-auto custom-scrollbar cursor-text" onClick={() => inputRef.current?.focus()}>
      <div className="space-y-2">
        {history.map((line, i) => (
          <div key={i} className={line.type === "command" ? "text-slate-300 mt-4" : "text-slate-400 ml-2"}>
            {line.type === "command" ? <span className="text-green-400">➜ ~ {line.content}</span> : line.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2 items-center">
        <span className="text-green-400">➜ ~</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="bg-transparent border-none outline-none text-slate-200 flex-1"
          autoFocus
        />
      </div>
      <div ref={endRef} />
    </div>
  );
};
