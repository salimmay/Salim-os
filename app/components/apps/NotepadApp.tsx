"use client";

import { useState } from "react";
import { useSound } from "../contexts/SoundContext";

export const NotepadApp = () => {
  const [text, setText] = useState("TODO:\n- Hire Salim\n- Check out his GitHub\n- Drink Coffee");
  const { play } = useSound();

  return (
    <textarea 
      className="w-full h-full bg-[#fff9c4] text-slate-800 p-4 font-handwriting resize-none outline-none text-lg" 
      value={text} 
      onChange={(e) => {
        setText(e.target.value);
        play('keyboard');
      }}
      style={{ fontFamily: '"Comic Sans MS", cursive, sans-serif' }} 
    />
  );
};
