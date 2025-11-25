"use client";

import { useEffect } from "react";
import { useSound } from "../contexts/SoundContext";

export const BSOD = ({ onRestart }: { onRestart: () => void }) => {
  const { play } = useSound();
  
  useEffect(() => {
    play('error');
  }, [play]);

  return (
    <div className="fixed inset-0 bg-[#0078d7] z-[100] flex flex-col items-center justify-center text-white font-mono p-10 cursor-none select-none">
      <div className="max-w-2xl">
        <div className="text-8xl mb-4">:(</div>
        <h1 className="text-2xl mb-8">Your PC ran into a problem. We're just collecting some error info, and then we'll restart for you.</h1>
        <div className="text-xl mb-8">0% complete</div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-white p-2"><div className="w-full h-full bg-black flex items-center justify-center text-[10px] text-center">QR CODE</div></div>
          <div className="text-sm space-y-1"><p>Stop code: CRITICAL_PROCESS_DIED</p><p>Error: USER_DID_NOT_HIRE_SALIM_YET</p></div>
        </div>
        <button onClick={onRestart} className="mt-12 px-6 py-2 border border-white hover:bg-white hover:text-[#0078d7] transition-colors cursor-pointer">FORCE RESTART</button>
      </div>
    </div>
  );
};
