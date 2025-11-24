// bg4.tsx
"use client";

import React, { useRef, useState, useEffect } from 'react';

const COLORS = {
  bg: '#000000',
  grid: 'rgba(71, 85, 105, 0.2)',
  diskOuter: '#7c3aed',
  diskInner: '#22d3ee',
  data: ['#3b82f6', '#8b5cf6', '#10b981'],
  frontend: '#22d3ee',
  backend: '#34d399',
  creative: '#c084fc',
  future: '#ffffff'
};

class SpacetimeGrid {
  points: {x: number, y: number, ox: number, oy: number}[];
  cols: number; rows: number; gap: number;

  constructor(w: number, h: number) {
    this.gap = 40;
    this.cols = Math.ceil(w / this.gap) + 1;
    this.rows = Math.ceil(h / this.gap) + 1;
    this.points = [];
    
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.points.push({
          x: i * this.gap, y: j * this.gap,
          ox: i * this.gap, oy: j * this.gap
        });
      }
    }
  }

  update(centerX: number, centerY: number, isReversed: boolean) {
    const strength = isReversed ? -2000 : 1000;
    
    this.points.forEach(p => {
      const dx = p.ox - centerX;
      const dy = p.oy - centerY;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      const pull = Math.max(0, strength / (dist + 1));
      
      const angle = Math.atan2(dy, dx);
      p.x = p.ox - Math.cos(angle) * pull;
      p.y = p.oy - Math.sin(angle) * pull;
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    
    ctx.beginPath();
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      if ((i + 1) % this.cols !== 0) {
        const right = this.points[i+1];
        ctx.moveTo(p.x, p.y); ctx.lineTo(right.x, right.y);
      }
      if (i + this.cols < this.points.length) {
        const down = this.points[i + this.cols];
        ctx.moveTo(p.x, p.y); ctx.lineTo(down.x, down.y);
      }
    }
    ctx.stroke();
  }
}

class BlackHole {
  x: number; y: number; radius: number; mass: number;
  accretionParticles: {angle: number, r: number, speed: number, size: number, color: string}[];
  pulse: number;

  constructor(w: number, h: number) {
    this.x = w / 2;
    this.y = h / 2;
    this.radius = 60;
    this.mass = 50;
    this.accretionParticles = [];
    this.pulse = 0;
    
    for(let i=0; i<800; i++) {
      this.accretionParticles.push({
        angle: Math.random() * Math.PI * 2,
        r: this.radius + Math.random() * 150,
        speed: 0.02 + Math.random() * 0.03,
        size: Math.random() * 2,
        color: Math.random() > 0.5 ? COLORS.diskOuter : COLORS.diskInner
      });
    }
  }

  update(isReversed: boolean) {
    this.pulse += 0.05;
    this.accretionParticles.forEach(p => {
      p.angle += p.speed * (isReversed ? -2 : 1);
      if (isReversed) {
         p.r += 2;
         if(p.r > 300) p.r = this.radius;
      } else {
         p.r = Math.max(this.radius, p.r + Math.sin(this.pulse + p.angle) * 0.5);
      }
    });
  }

  draw(ctx: CanvasRenderingContext2D, isReversed: boolean) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    this.accretionParticles.forEach(p => {
      const px = Math.cos(p.angle) * p.r;
      const py = Math.sin(p.angle) * p.r * 0.4;
      
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI*2); ctx.fill();
    });

    const g = ctx.createRadialGradient(0, 0, this.radius * 0.8, 0, 0, this.radius * 1.5);
    if (isReversed) {
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.5, '#22d3ee');
      g.addColorStop(1, 'transparent');
    } else {
      g.addColorStop(0, '#000000');
      g.addColorStop(0.5, '#7c3aed');
      g.addColorStop(1, 'transparent');
    }
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, this.radius * 1.5, 0, Math.PI*2); ctx.fill();

    ctx.fillStyle = isReversed ? '#fff' : '#000';
    ctx.beginPath(); ctx.arc(0, 0, isReversed ? this.radius * 0.8 : this.radius, 0, Math.PI*2); ctx.fill();
    
    if (isReversed) {
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 2;
        for(let i=0; i<8; i++) {
           ctx.rotate(Date.now() * 0.001);
           ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(1000, 0); ctx.stroke();
           ctx.rotate(-Date.now() * 0.001);
           ctx.rotate(Math.PI/4);
        }
    }

    ctx.restore();
  }
}

class DataFragment {
  x: number; y: number; vx: number; vy: number; 
  val: string; size: number; color: string; dead: boolean;
  
  constructor(w: number, h: number) {
    const side = Math.floor(Math.random() * 4);
    if (side === 0) { this.x = Math.random() * w; this.y = -20; }
    else if (side === 1) { this.x = w + 20; this.y = Math.random() * h; }
    else if (side === 2) { this.x = Math.random() * w; this.y = h + 20; }
    else { this.x = -20; this.y = Math.random() * h; }

    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    
    this.val = Math.random() > 0.5 ? "1" : "0";
    if (Math.random() > 0.9) this.val = "0x" + Math.floor(Math.random()*16).toString(16).toUpperCase();
    
    this.size = 10 + Math.random() * 8;
    this.color = COLORS.data[Math.floor(Math.random() * COLORS.data.length)];
    this.dead = false;
  }

  update(cx: number, cy: number, isReversed: boolean) {
    const dx = cx - this.x;
    const dy = cy - this.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const angle = Math.atan2(dy, dx);

    if (isReversed) {
        const force = 1000 / (dist + 1);
        this.vx -= Math.cos(angle) * force * 0.05;
        this.vy -= Math.sin(angle) * force * 0.05;
    } else {
        const force = 50 / (dist + 1);
        this.vx += Math.cos(angle) * force;
        this.vy += Math.sin(angle) * force;
        
        this.vx += Math.cos(angle + Math.PI/2) * 0.1;
        this.vy += Math.sin(angle + Math.PI/2) * 0.1;
    }

    this.x += this.vx;
    this.y += this.vy;

    if (dist < 30 && !isReversed) this.dead = true;
    if (dist > 2000) this.dead = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.font = `${this.size}px monospace`;
    ctx.fillText(this.val, this.x, this.y);
  }
}

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
    const colorValue = COLORS[this.type as keyof typeof COLORS];
    this.color = typeof colorValue === 'string' ? colorValue : colorValue[0];
  }
  
  update(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number, mouseSpeed: number, activeCategory: string | null, time: number, w: number, h: number, isMouseDown: boolean, cx: number, cy: number, isReversed: boolean) {
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
            const dx = cx - this.x;
            const dy = cy - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const angle = Math.atan2(dy, dx);

            if (isReversed) {
                this.vx -= Math.cos(angle) * 0.5;
                this.vy -= Math.sin(angle) * 0.5;
            } else {
                if (dist > 100) {
                    this.vx += Math.cos(angle) * 0.05;
                    this.vy += Math.sin(angle) * 0.05;
                }
                this.vx += Math.cos(angle + Math.PI/2) * 0.02;
                this.vy += Math.sin(angle + Math.PI/2) * 0.02;
            }

            this.vx *= 0.96; this.vy *= 0.96;
            if (Math.abs(this.vx) < 0.2) this.vx += (Math.random() - 0.5) * 0.1;
            if (Math.abs(this.vy) < 0.2) this.vy += (Math.random() - 0.5) * 0.1;
        }
        
        if (isMouseDown) {
            const dx = mouseX - this.x; const dy = mouseY - this.y; const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist > 0) { this.vx += (dx / dist) * 0.5; this.vy += (dy / dist) * 0.5; }
        } else {
            const dx = mouseX - this.x; const dy = mouseY - this.y; const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
               const force = (150 - dist) / 150; const kick = force * mouseSpeed * 0.5;
               this.vx -= (dx/dist) * kick; this.vy -= (dy/dist) * kick;
            }
        }
        this.x += this.vx; this.y += this.vy;
    }
    if (this.x + this.size > w+200 || this.x - this.size < -200) this.vx = -this.vx;
    if (this.y + this.size > h+200 || this.y - this.size < -200) this.vy = -this.vy;
    this.draw(ctx, activeCategory);
  }

  draw(ctx: CanvasRenderingContext2D, activeCategory: string | null) {
    let alpha = 1; if (activeCategory && this.type !== activeCategory) alpha = 0.1;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.font = `bold ${this.size}px monospace`;
    if (this.type === 'future') {
      ctx.strokeStyle = this.color; ctx.lineWidth = 1; ctx.strokeText(this.text, this.x, this.y);
    } else {
      ctx.fillText(this.text, this.x, this.y);
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

const Background4 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const filterRef = useRef<string | null>(null);

  const handleFilterClick = (type: string) => {
    const newVal = activeFilter === type ? null : type;
    setActiveFilter(newVal);
    filterRef.current = newVal;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const skills = [
      { text: "React", type: "frontend" }, { text: "Next.js", type: "frontend" },
      { text: "TypeScript", type: "frontend" }, { text: "Tailwind", type: "frontend" },
      { text: "Node.js", type: "backend" }, { text: "MongoDB", type: "backend" },
      { text: "Docker", type: "backend" }, { text: "AWS", type: "future" },
      { text: "Figma", type: "creative" }, { text: "Three.js", type: "creative" },
      { text: "Rust", type: "future" }, { text: "AI/ML", type: "future" },
    ];

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width; canvas.height = height;

    const hole = new BlackHole(width, height);
    const grid = new SpacetimeGrid(width, height);
    let fragments: DataFragment[] = [];
    const particleSkills = skills.map((s, i) => new SkillParticle(s, i, width, height));

    let isMouseDown = false;
    let animationId: number;
    let time = 0;
    let mouseX = 0, mouseY = 0, lastMouseX = 0, lastMouseY = 0, mouseSpeed = 0;

    const handleResize = () => {
       width = window.innerWidth; height = window.innerHeight;
       canvas.width = width; canvas.height = height;
       Object.assign(grid, new SpacetimeGrid(width, height));
       hole.x = width/2; hole.y = height/2;
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousedown', () => isMouseDown = true);
    window.addEventListener('mouseup', () => isMouseDown = false);
    window.addEventListener('mousemove', (e) => { 
      mouseX = e.clientX; mouseY = e.clientY; 
      const dist = Math.sqrt(Math.pow(mouseX - lastMouseX, 2) + Math.pow(mouseY - lastMouseY, 2));
      mouseSpeed = dist; lastMouseX = mouseX; lastMouseY = mouseY;
    });

    const animate = () => {
      time++;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(0, 0, width, height);

      hole.update(isMouseDown);
      grid.update(hole.x, hole.y, isMouseDown);

      grid.draw(ctx);

      if (fragments.length < 100) fragments.push(new DataFragment(width, height));
      fragments.forEach(f => {
          f.update(hole.x, hole.y, isMouseDown);
          f.draw(ctx);
      });
      fragments = fragments.filter(f => !f.dead);

      hole.draw(ctx, isMouseDown);

      particleSkills.forEach(p => {
          p.update(ctx, mouseX, mouseY, mouseSpeed, filterRef.current, time, width, height, isMouseDown, hole.x, hole.y, isMouseDown);
      });
      mouseSpeed *= 0.9;
      
      if (isMouseDown) {
          ctx.font = "20px monospace";
          ctx.fillStyle = "#22d3ee";
          ctx.fillText(">> EVENT HORIZON BREACHED <<", hole.x - 140, hole.y + 120);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', () => isMouseDown = true);
      window.removeEventListener('mouseup', () => isMouseDown = false);
      cancelAnimationFrame(animationId);
    };
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
      <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-black pointer-events-auto" />
      <div className="fixed bottom-10 left-10 z-10 text-slate-500 text-xs font-mono pointer-events-none hidden md:block">
         <p>SINGULARITY STATUS: {`[ STABLE ]`}</p>
         <p>CLICK_HOLD: REVERSE POLARITY</p>
      </div>
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

export default Background4;