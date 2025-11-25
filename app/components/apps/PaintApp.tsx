"use client";

import { useRef, useState, useEffect } from "react";
import { useSound } from "../contexts/SoundContext";

export const PaintApp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#ffffff");
  const [isDrawing, setIsDrawing] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
      }
    }
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.strokeStyle = color;
  }, [color]);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    setIsDrawing(false);
  };

  return (
    <div className="h-full bg-slate-800 flex flex-col">
      <div className="p-2 bg-slate-700 flex gap-2 items-center" onMouseDown={(e) => e.stopPropagation()}>
        {['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#ffffff'].map(c =>
          <button
            key={c}
            onClick={(e) => { 
              e.stopPropagation();
              setColor(c); 
              play('click'); 
            }}
            className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
            style={{ backgroundColor: c }}
          />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            const c = canvasRef.current;
            const ctx = c?.getContext('2d');
            if (c && ctx) {
              ctx.clearRect(0, 0, c.width, c.height);
              play('success');
            }
          }}
          className="ml-auto text-xs text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600"
        >
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="flex-1 bg-[#1e1e1e] cursor-crosshair"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
      />
    </div>
  );
};
