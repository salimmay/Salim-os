"use client";

import React, { useRef, useState, useEffect } from 'react';

const COLORS = {
  frontend: '#22d3ee',
  backend: '#34d399',
  creative: '#c084fc',
  future: '#ffffff',
  explosions: ['#ef4444', '#f59e0b', '#ffffff']
};

// --- 1. STARS (Background) ---
class Star {
  x: number; y: number; size: number; alpha: number; speed: number;
  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 1.5;
    this.alpha = Math.random();
    this.speed = Math.random() * 0.05;
  }
  update() {
    this.alpha += this.speed;
    if (this.alpha > 1 || this.alpha < 0) this.speed = -this.speed;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
  }
}

// --- 2. PLANETS (Mid-Background) ---
class Planet {
  x: number; y: number; radius: number; color: string; hasRing: boolean; type: string;
  constructor(w: number, h: number, type: 'sun' | 'gas' | 'rock') {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.type = type;
    
    if (type === 'sun') {
      this.radius = 80 + Math.random() * 40;
      this.color = '#fb923c'; // Orange
      this.hasRing = false;
    } else if (type === 'gas') {
      this.radius = 30 + Math.random() * 20;
      this.color = Math.random() > 0.5 ? '#4c1d95' : '#0f766e'; // Purple or Teal
      this.hasRing = true;
    } else {
      this.radius = 10 + Math.random() * 15;
      this.color = '#3b82f6'; // Blue
      this.hasRing = false;
    }
  }
  
  update() {
    this.x += 0.05; // Slow drift
    // Wrap around screen
    if(this.x > window.innerWidth + 100) this.x = -100;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.type === 'sun') {
        const g = ctx.createRadialGradient(0, 0, this.radius * 0.2, 0, 0, this.radius * 1.5);
        g.addColorStop(0, 'rgba(253, 186, 116, 0.9)'); 
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, this.radius * 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff7ed'; ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2); ctx.fill();
    } else {
        // Draw Ring Back
        if (this.hasRing) {
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.ellipse(0, 0, this.radius * 1.8, this.radius * 0.5, -0.2, Math.PI, 0); ctx.stroke();
        }
        // Body
        const g = ctx.createRadialGradient(-5, -5, 0, 0, 0, this.radius);
        g.addColorStop(0, this.color); g.addColorStop(1, '#020617');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI*2); ctx.fill();
        // Draw Ring Front
        if (this.hasRing) {
            ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.ellipse(0, 0, this.radius * 1.8, this.radius * 0.5, -0.2, 0, Math.PI); ctx.stroke();
        }
    }
    ctx.restore();
  }
}

// --- 3. SATELLITE (Interactive Element) ---
class Satellite {
  x: number; y: number; angle: number;
  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.angle = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += 0.2; this.y += 0.05; this.angle += 0.002;
    if(this.x > window.innerWidth + 50) this.x = -50;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    // Panels
    ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1;
    ctx.fillRect(-30, -10, 20, 20); ctx.strokeRect(-30, -10, 20, 20); // Left
    ctx.fillRect(10, -10, 20, 20); ctx.strokeRect(10, -10, 20, 20);   // Right
    
    // Body
    ctx.fillStyle = '#94a3b8'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill();
    // Blink
    if(Math.floor(Date.now() / 500) % 2 === 0) {
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }
}

// --- 4. EXPLOSIONS (Physics) ---
class Explosion {
  x: number; y: number; particles: any[]; dead: boolean;
  constructor(x: number, y: number) {
    this.x = x; this.y = y; this.dead = false; this.particles = [];
    for(let i=0; i<30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      this.particles.push({ 
        x: 0, y: 0, 
        vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, 
        life: 1.0, 
        color: COLORS.explosions[Math.floor(Math.random() * COLORS.explosions.length)],
        size: Math.random() * 3
      });
    }
  }
  update() {
    let alive = false;
    this.particles.forEach(p => { 
        p.x+=p.vx; p.y+=p.vy; 
        p.life-=0.02; // Fade out
        p.vx *= 0.95; p.vy *= 0.95; // Friction
        if(p.life>0) alive=true; 
    });
    if(!alive) this.dead = true;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y);
    this.particles.forEach(p => { 
        if(p.life>0) { 
            ctx.globalAlpha=p.life; ctx.fillStyle=p.color; 
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill(); 
        } 
    });
    ctx.restore();
  }
}

// --- 5. ROCKETS (Chaotic Movers) ---
class Rocket {
  x: number; y: number; vx: number; vy: number; dead: boolean; size: number;
  constructor(w: number, h: number) {
    this.dead = false;
    this.size = 15; // Hitbox size
    // Spawn logic: Edges
    const side = Math.floor(Math.random() * 4);
    if (side === 0) { this.x = Math.random() * w; this.y = -50; }
    else if (side === 1) { this.x = w + 50; this.y = Math.random() * h; }
    else if (side === 2) { this.x = Math.random() * w; this.y = h + 50; }
    else { this.x = -50; this.y = Math.random() * h; }
    
    // Target roughly center but messy
    const targetX = (w/2) + (Math.random()-0.5)*w;
    const targetY = (h/2) + (Math.random()-0.5)*h;
    const angle = Math.atan2(targetY - this.y, targetX - this.x);
    const speed = 2 + Math.random() * 3;
    
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }
  update(isMouseDown: boolean, mouseX: number, mouseY: number, w: number, h: number) {
    // Mouse attraction (Vortex effect)
    if (isMouseDown) {
       const dx = mouseX - this.x; const dy = mouseY - this.y; const dist = Math.sqrt(dx*dx + dy*dy);
       if (dist > 10) { this.vx += (dx/dist) * 0.5; this.vy += (dy/dist) * 0.5; }
    }
    this.x += this.vx; this.y += this.vy;
    // Kill if way off screen
    if (this.x < -200 || this.x > w + 200 || this.y < -200 || this.y > h + 200) this.dead = true;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(Math.atan2(this.vy, this.vx));
    
    // Body
    ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.ellipse(0, 0, 15, 5, 0, 0, Math.PI * 2); ctx.fill();
    // Wings
    ctx.fillStyle = '#64748b'; ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-12, 8); ctx.lineTo(2, 0); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-12, -8); ctx.lineTo(2, 0); ctx.fill();
    // Flame
    ctx.fillStyle = Math.random() > 0.5 ? '#f59e0b' : '#ef4444'; 
    ctx.beginPath(); ctx.moveTo(-15, -3); ctx.lineTo(-25 - Math.random() * 8, 0); ctx.lineTo(-15, 3); ctx.fill();
    
    ctx.restore();
  }
}

// --- 6. SKILLS (User Logic Preserved) ---
class SkillParticle {
  x: number; y: number; vx: number; vy: number; text: string; color: string; size: number; type: string; exploded: boolean; id: number;
  constructor(data: { text: string, type: string }, index: number, w: number, h: number) {
    this.id = index;
    this.x = w / 2; this.y = h / 2;
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 4; 
    this.vx = Math.cos(angle) * velocity; this.vy = Math.sin(angle) * velocity;
    this.text = data.text; this.type = data.type;
    this.size = data.type === 'future' ? 12 : 14 + Math.random() * 6;
    this.exploded = false;
    const c = COLORS[this.type as keyof typeof COLORS];
    this.color = typeof c === 'string' ? c : '#fff';
  }
  
  // (Kept your exact logic for update, just cleaned type signatures)
  update(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number, mouseSpeed: number, activeCategory: string | null, time: number, w: number, h: number, isMouseDown: boolean) {
    if (activeCategory) {
       if (this.type === activeCategory) {
         const centerX = w / 2; const centerY = h / 2;
         const angle = (time * 0.05) + (this.id * 0.5);
         const radius = 150 + Math.sin(time * 0.1 + this.id) * 30;
         const targetX = centerX + Math.cos(angle) * radius; const targetY = centerY + Math.sin(angle) * radius;
         this.x += (targetX - this.x) * 0.1; this.y += (targetY - this.y) * 0.1;
         this.vx = 0; this.vy = 0;
       } else {
         this.x += this.vx; this.y += this.vy;
         const dx = this.x - w/2; const dy = this.y - h/2;
         this.vx += dx * 0.0005; this.vy += dy * 0.0005;
       }
    } else {
        if (!this.exploded) {
           this.vx *= 0.99; this.vy *= 0.99;
           if (Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1) this.exploded = true;
        } else {
            this.vx *= 0.96; this.vy *= 0.96;
            if (Math.abs(this.vx) < 0.2) this.vx += (Math.random() - 0.5) * 0.1;
            if (Math.abs(this.vy) < 0.2) this.vy += (Math.random() - 0.5) * 0.1;
        }
        if (isMouseDown) {
            const dx = mouseX - this.x; const dy = mouseY - this.y; const dist = Math.sqrt(dx*dx + dy*dy);
            this.vx += (dx / dist) * 0.5; this.vy += (dy / dist) * 0.5;
        } else {
            const dx = mouseX - this.x; const dy = mouseY - this.y; const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
               const force = (150 - dist) / 150; const kick = force * mouseSpeed * 0.5;
               this.vx -= (dx/dist) * kick; this.vy -= (dy/dist) * kick;
            }
        }
        this.x += this.vx; this.y += this.vy;
    }
    // Wall Bounce
    if (this.x + this.size > w+200 || this.x - this.size < -200) this.vx = -this.vx;
    if (this.y + this.size > h+200 || this.y - this.size < -200) this.vy = -this.vy;
    this.draw(ctx, activeCategory);
  }

  draw(ctx: CanvasRenderingContext2D, activeCategory: string | null) {
    let alpha = 1; if (activeCategory && this.type !== activeCategory) alpha = 0.1;
    ctx.globalAlpha = alpha;
    ctx.font = `bold ${this.size}px monospace`;
    if (this.type === 'future') { 
      ctx.strokeStyle = this.color; ctx.lineWidth = 1; ctx.strokeText(this.text, this.x, this.y); 
    } else { 
      ctx.fillStyle = this.color; ctx.fillText(this.text, this.x, this.y); 
    }
    ctx.globalAlpha = 1;
  }
}

// --- MAIN COMPONENT ---
const Background1 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filterRef = useRef<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleFilterClick = (type: string) => {
    const newValue = activeFilter === type ? null : type;
    setActiveFilter(newValue);
    filterRef.current = newValue;
  };

  const LegendItem = ({ color, label, type }: { color: string, label: string, type: string }) => {
    const isActive = activeFilter === type;
    return (
      <div onClick={() => handleFilterClick(type)} className={`flex items-center gap-2 cursor-pointer p-1.5 rounded transition-all duration-300 ${isActive ? 'bg-white/10 scale-105' : 'hover:bg-white/5'}`}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: isActive ? `0 0 12px ${color}` : 'none' }}></div>
        <span className={`text-slate-300 font-medium ${isActive ? 'text-white' : ''}`}>{label}</span>
      </div>
    );
  };

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-auto" />
      <div className="fixed bottom-24 right-4 z-10 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs shadow-2xl transform transition-all hover:scale-105 hidden md:block pointer-events-auto">
        <h4 className="text-slate-400 font-bold mb-3 uppercase tracking-wider text-[10px] border-b border-white/10 pb-2">System Protocol</h4>
        <div className="space-y-1">
          <LegendItem color="#22d3ee" label="Frontend Core" type="frontend" />
          <LegendItem color="#34d399" label="Backend Systems" type="backend" />
          <LegendItem color="#c084fc" label="Creative Engine" type="creative" />
          <LegendItem color="transparent" label="Future Modules" type="future" />
        </div>
      </div>
    </>
  );
};
export default Background1;