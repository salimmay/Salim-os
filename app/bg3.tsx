// bg3.tsx
"use client";

import React, { useRef, useState, useEffect } from 'react';

const COLORS = {
  frontend: '#22d3ee',
  backend: '#34d399',
  creative: '#c084fc',
  future: '#ffffff',
  coreSafe: '#3b82f6',
  coreDanger: '#ef4444',
  explosions: ['#ef4444', '#f59e0b', '#ffffff'],
  grid: 'rgba(30, 41, 59, 0.5)',
  web: 'rgba(148, 163, 184, 0.15)'
};

// --- 1. SINGULARITY CORE ---
class SingularityCore {
  x: number; y: number; radius: number; baseRadius: number; angle: number; color: string; shockwave: number; isAngry: boolean;
  constructor(w: number, h: number) {
    this.x = w / 2; this.y = h / 2;
    this.baseRadius = 45; this.radius = 45; this.angle = 0;
    this.color = COLORS.coreSafe; this.shockwave = 0; this.isAngry = false;
  }
  resize(w: number, h: number) { this.x = w / 2; this.y = h / 2; }
  triggerShockwave() { this.shockwave = 1; }
  update(mouseX: number, mouseY: number, time: number) {
    const dist = Math.hypot(mouseX - this.x, mouseY - this.y);
    if (dist < 150) { this.isAngry = true; this.color = COLORS.coreDanger; this.angle += 0.08; } 
    else { this.isAngry = false; this.color = COLORS.coreSafe; this.angle += 0.01; }
    this.radius = this.baseRadius + Math.sin(time * 0.05) * 5;
    if (this.shockwave > 0) { this.shockwave += 15; if (this.shockwave > 1200) this.shockwave = 0; }
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y);
    if (this.shockwave > 0) {
      ctx.beginPath(); ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - this.shockwave/1000)})`;
      ctx.lineWidth = 50; ctx.arc(0, 0, this.shockwave, 0, Math.PI * 2); ctx.stroke();
    }
    const g = ctx.createRadialGradient(0, 0, this.radius * 0.2, 0, 0, this.radius * 2);
    g.addColorStop(0, this.isAngry ? 'rgba(239, 68, 68, 0.6)' : 'rgba(59, 130, 246, 0.6)'); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, this.radius * 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, this.radius * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = this.isAngry ? '#fca5a5' : '#93c5fd'; ctx.lineWidth = 2;
    [0, Math.PI/3, -Math.PI/3].forEach(rot => {
        ctx.rotate(rot + this.angle);
        ctx.beginPath(); ctx.ellipse(0, 0, this.radius * 1.8, this.radius * 0.6, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.rotate(-(rot + this.angle));
    });
    ctx.restore();
  }
}

class Star {
  x: number; y: number; size: number; alpha: number; speed: number;
  constructor(w: number, h: number) {
    this.x = Math.random() * w; this.y = Math.random() * h;
    this.size = Math.random() * 1.5; this.alpha = Math.random() * 0.8 + 0.2;
    this.speed = Math.random() * 0.05;
  }
  update() {
    this.alpha += this.speed;
    if (this.alpha > 1 || this.alpha < 0.2) this.speed = -this.speed;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
  }
}

class Explosion {
  x: number; y: number; particles: any[]; dead: boolean;
  constructor(x: number, y: number) {
    this.x = x; this.y = y; this.dead = false; this.particles = [];
    for(let i=0; i<30; i++) {
      const angle = Math.random() * Math.PI * 2; const speed = Math.random() * 4 + 1;
      this.particles.push({ 
        x: 0, y: 0, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, 
        life: 1.0, color: COLORS.explosions[Math.floor(Math.random() * COLORS.explosions.length)], size: Math.random() * 3
      });
    }
  }
  update() {
    let alive = false;
    this.particles.forEach(p => { 
        p.x+=p.vx; p.y+=p.vy; p.life-=0.02; p.vx *= 0.95; p.vy *= 0.95; 
        if(p.life>0) alive=true; 
    });
    if(!alive) this.dead = true;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y);
    this.particles.forEach(p => { 
        if(p.life>0) { ctx.globalAlpha=p.life; ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill(); } 
    });
    ctx.restore();
  }
}

class Rocket {
  x: number; y: number; vx: number; vy: number; dead: boolean; size: number;
  constructor(w: number, h: number) {
    this.dead = false; this.size = 15;
    const side = Math.floor(Math.random() * 4);
    if (side === 0) { this.x = Math.random() * w; this.y = -50; }
    else if (side === 1) { this.x = w + 50; this.y = Math.random() * h; }
    else if (side === 2) { this.x = Math.random() * w; this.y = h + 50; }
    else { this.x = -50; this.y = Math.random() * h; }
    
    const targetX = w/2 + (Math.random()-0.5)*300; 
    const targetY = h/2 + (Math.random()-0.5)*300;
    const angle = Math.atan2(targetY - this.y, targetX - this.x);
    const speed = 2 + Math.random() * 3;
    this.vx = Math.cos(angle) * speed; this.vy = Math.sin(angle) * speed;
  }
  update(isMouseDown: boolean, mouseX: number, mouseY: number, w: number, h: number, shockwaveRadius: number) {
    if (shockwaveRadius > 0) {
      const dist = Math.hypot(this.x - w/2, this.y - h/2);
      if (Math.abs(dist - shockwaveRadius) < 50) { this.dead = true; return "EXPLODE"; }
    }
    if (isMouseDown) {
       const dx = mouseX - this.x; const dy = mouseY - this.y; const dist = Math.sqrt(dx*dx + dy*dy);
       if (dist > 10) { this.vx += (dx/dist) * 0.5; this.vy += (dy/dist) * 0.5; }
    }
    this.x += this.vx; this.y += this.vy;
    if (this.x < -200 || this.x > w + 200 || this.y < -200 || this.y > h + 200) this.dead = true;
    return null;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(Math.atan2(this.vy, this.vx));
    ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.ellipse(0, 0, 15, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = Math.random() > 0.5 ? '#f59e0b' : '#ef4444';
    ctx.beginPath(); ctx.moveTo(-15, -3); ctx.lineTo(-25 - Math.random() * 8, 0); ctx.lineTo(-15, 3); ctx.fill();
    ctx.restore();
  }
}

class SkillParticle {
  x: number; y: number; vx: number; vy: number; text: string; color: string; size: number; type: string; id: number; exploded: boolean;
  constructor(data: { text: string, type: string }, index: number, w: number, h: number) {
    this.id = index;
    this.x = w / 2; this.y = h / 2;
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 4;
    this.vx = Math.cos(angle) * velocity; this.vy = Math.sin(angle) * velocity;
    this.text = data.text; this.type = data.type;
    this.size = data.type === 'future' ? 12 : 14 + Math.random() * 6;
    this.exploded = false;
    const colorValue = COLORS[this.type as keyof typeof COLORS] || '#fff';
    this.color = typeof colorValue === 'string' ? colorValue : colorValue[0];
  }
  update(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number, mouseSpeed: number, activeCategory: string | null, time: number, w: number, h: number, isMouseDown: boolean, shockwaveRadius: number) {
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
            const dx = (w/2) - this.x; const dy = (h/2) - this.y;
            this.vx += dx * 0.0001; this.vy += dy * 0.0001;
            this.vx *= 0.96; this.vy *= 0.96;
            if (Math.abs(this.vx) < 0.2) this.vx += (Math.random() - 0.5) * 0.1;
            if (Math.abs(this.vy) < 0.2) this.vy += (Math.random() - 0.5) * 0.1;
        }
        
        if (shockwaveRadius > 0) {
           const dx = (w/2) - this.x; const dy = (h/2) - this.y;
           const distCenter = Math.sqrt(dx*dx + dy*dy);
           if (Math.abs(distCenter - shockwaveRadius) < 100) {
               const angle = Math.atan2(-dy, -dx); 
               this.vx += Math.cos(angle) * 5; 
               this.vy += Math.sin(angle) * 5;
           }
        }
        
        if (isMouseDown) {
            const dx = mouseX - this.x; const dy = mouseY - this.y; const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist > 0) { this.vx += (dx / dist) * 0.5; this.vy += (dy / dist) * 0.5; }
        } else {
            const mdx = mouseX - this.x; const mdy = mouseY - this.y; const mdist = Math.sqrt(mdx*mdx + mdy*mdy);
            if (mdist < 150) { 
              const force = (150 - mdist) / 150; const kick = force * mouseSpeed * 0.5;
              this.vx -= (mdx/mdist) * kick; this.vy -= (mdy/mdist) * kick;
            }
        }
        this.x += this.vx; this.y += this.vy;
    }
    if (this.x < 0 || this.x > w) this.vx *= -1; if (this.y < 0 || this.y > h) this.vy *= -1;
    this.draw(ctx, activeCategory);
  }
  draw(ctx: CanvasRenderingContext2D, activeFilter: string | null) {
    let alpha = 1;
    if (activeFilter && this.type !== activeFilter) {
      alpha = 0.1;
    }
    ctx.globalAlpha = alpha;
    ctx.font = `bold ${this.size}px monospace`;
    if (this.type === 'future') {
      ctx.strokeStyle = this.color; ctx.lineWidth = 1; ctx.strokeText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = this.color; 
      ctx.fillText(this.text, this.x, this.y);
    }
    ctx.globalAlpha = 1;
  }
}

const Background3 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filterRef = useRef<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleFilterClick = (type: string) => {
    const newValue = activeFilter === type ? null : type;
    setActiveFilter(newValue);
    filterRef.current = newValue;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const allSkills = [
      { text: "React", type: "frontend" }, { text: "Next.js", type: "frontend" },
      { text: "TypeScript", type: "frontend" }, { text: "Tailwind", type: "frontend" },
      { text: "Node.js", type: "backend" }, { text: "MongoDB", type: "backend" },
      { text: "Docker", type: "backend" }, { text: "AWS", type: "future" },
      { text: "Figma", type: "creative" }, { text: "Three.js", type: "creative" },
      { text: "Rust", type: "future" }, { text: "AI/ML", type: "future" },
    ];

    let particles: SkillParticle[] = [];
    let stars: Star[] = [];
    let rockets: Rocket[] = [];
    let explosions: Explosion[] = [];
    let core: SingularityCore;
    
    let animationFrameId: number;
    let isMouseDown = false;
    let time = 0;
    let mouseX = 0, mouseY = 0, lastMouseX = 0, lastMouseY = 0, mouseSpeed = 0;
    const trail: {x:number, y:number}[] = [];

    const init = () => {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      stars = Array.from({ length: 150 }, () => new Star(canvas.width, canvas.height));
      core = new SingularityCore(canvas.width, canvas.height);
      particles = allSkills.map((s, i) => new SkillParticle(s, i, canvas.width, canvas.height));
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousedown', () => isMouseDown = true);
    window.addEventListener('mouseup', () => isMouseDown = false);
    window.addEventListener('click', (e) => {
        const dist = Math.hypot(e.clientX - core.x, e.clientY - core.y);
        if(dist < 100) core.triggerShockwave();
    });
    window.addEventListener('mousemove', (e) => { 
      mouseX = e.clientX; mouseY = e.clientY; 
      const dist = Math.sqrt(Math.pow(mouseX - lastMouseX, 2) + Math.pow(mouseY - lastMouseY, 2));
      mouseSpeed = dist; lastMouseX = mouseX; lastMouseY = mouseY;
    });

    init();

    const drawGrid = () => {
        const w = canvas.width;
        const h = canvas.height;
        ctx.save();
        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 1;
        
        const horizon = h * 0.55;
        const step = (time * 0.5) % 50;
        
        ctx.beginPath();
        for (let i = -w; i < w * 2; i += 100) {
            ctx.moveTo(i, h);
            ctx.lineTo(w/2 + (i - w/2) * 0.2, horizon); 
        }
        for (let i = h; i > horizon; i -= 50) {
            const y = i + step; 
            if (y > h) continue;
            ctx.moveTo(0, y); ctx.lineTo(w, y);
        }
        ctx.stroke();
        
        const g = ctx.createLinearGradient(0, horizon, 0, h);
        g.addColorStop(0, 'rgba(2, 6, 23, 1)');
        g.addColorStop(0.2, 'rgba(2, 6, 23, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        
        ctx.restore();
    };

    const animate = () => {
      if (!ctx) return;
      time++;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#020617'); gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid();

      ctx.lineWidth = 0.3; ctx.strokeStyle = COLORS.web;
      stars.forEach((s, index) => {
          s.update();
          s.draw(ctx);
          for(let j = index + 1; j < stars.length; j++) {
              const s2 = stars[j];
              const dist = Math.hypot(s.x - s2.x, s.y - s2.y);
              if (dist < 120) {
                  ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s2.x, s2.y); ctx.stroke();
              }
          }
      });

      trail.push({x: mouseX, y: mouseY});
      if(trail.length > 20) trail.shift();
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 2;
      for(let i=0; i<trail.length-1; i++) {
          const p1 = trail[i]; const p2 = trail[i+1];
          ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
      }
      ctx.stroke();

      core.update(mouseX, mouseY, time);
      core.draw(ctx);

      if (rockets.length < 6 && Math.random() < 0.04) rockets.push(new Rocket(canvas.width, canvas.height));
      
      for (let i = 0; i < rockets.length; i++) {
        const r = rockets[i];
        const status = r.update(isMouseDown, mouseX, mouseY, canvas.width, canvas.height, core.shockwave);
        
        const distCore = Math.hypot(r.x - core.x, r.y - core.y);
        if (distCore < core.radius + 10) {
            r.dead = true; 
            explosions.push(new Explosion(r.x, r.y));
            core.isAngry = true; setTimeout(() => core.isAngry = false, 200);
        } else if (status === "EXPLODE") {
            explosions.push(new Explosion(r.x, r.y));
        }

        for(let j = i+1; j < rockets.length; j++) {
            const r2 = rockets[j];
            if(Math.hypot(r.x - r2.x, r.y - r2.y) < 30) {
                r.dead = true; r2.dead = true;
                explosions.push(new Explosion((r.x+r2.x)/2, (r.y+r2.y)/2));
            }
        }
        r.draw(ctx);
      }
      rockets = rockets.filter(r => !r.dead);

      explosions.forEach(ex => { ex.update(); ex.draw(ctx); });
      explosions = explosions.filter(ex => !ex.dead);

      particles.forEach(p => {
          p.update(ctx, mouseX, mouseY, mouseSpeed, filterRef.current, time, canvas.width, canvas.height, isMouseDown, core.shockwave);
          if (!filterRef.current || p.type === filterRef.current) {
            stars.forEach(s => {
                const dist = Math.hypot(p.x - s.x, p.y - s.y);
                if(dist < 80) {
                    ctx.beginPath(); ctx.strokeStyle = p.color; ctx.globalAlpha = 0.2;
                    ctx.moveTo(p.x, p.y); ctx.lineTo(s.x, s.y); ctx.stroke(); ctx.globalAlpha = 1;
                }
            });
          }
      });
      mouseSpeed *= 0.9;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', init); };
  }, []);

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

export default Background3;