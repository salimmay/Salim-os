"use client";

import { useState } from "react";
import { useSound } from "../contexts/SoundContext";

export const CalculatorApp = () => {
  const [display, setDisplay] = useState("0");
  const { play } = useSound();

  const handlePress = (val: string) => {
    play('click');
    if (val === "C") {
      setDisplay("0");
    } else if (val === "=") {
      try {
        setDisplay(eval(display).toString());
        play('success');
      } catch {
        setDisplay("Error");
        play('error');
      }
    } else {
      setDisplay(prev => prev === "0" ? val : prev + val);
    }
  };

  return (
    <div className="h-full bg-slate-800 p-4 flex flex-col gap-4">
      <div className="bg-slate-950 p-4 text-right text-2xl font-mono text-green-400 rounded shadow-inner overflow-hidden">{display}</div>
      <div className="grid grid-cols-4 gap-2 flex-1">
        <button onClick={() => handlePress("C")} className="col-span-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded p-2 active:scale-95 transition-transform">CLEAR</button>
        {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"].map(b =>
          <button
            key={b}
            onClick={() => handlePress(b)}
            className={`font-bold rounded p-2 active:scale-95 transition-transform ${['/', '*', '-', '+', '='].includes(b) ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}
          >
            {b}
          </button>
        )}
      </div>
    </div>
  );
};
