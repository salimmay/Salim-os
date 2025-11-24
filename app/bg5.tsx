// bg5.tsx
"use client";

import React, { useRef, useState, useEffect } from 'react';

const COLORS = {
  bg: '#020617',
  hex: 'rgba(30, 41, 59, 0.3)',
  hexActive: 'rgba(56, 189, 248, 0.1)',
  core: '#3b82f6',
  coreShield: 'rgba(59, 130, 246, 0.2)',
  guardian: '#22d3ee',
  virus: '#ef4444',
  laser: '#bef264',
  explosion: ['#ef4444', '#f59e0b', '#ffffff'],
  frontend: '#22d3ee',
  backend: '#34d399',
  creative: '#c084fc',
  future: '#ffffff'
};

class HexGrid {
  hexagons: {x: number, y: number, size: number, active: number}[];
  constructor(w: number, h: number) {
    this.hexagons = [];
    const size = 40;
    const wStep = size * Math.sqrt(3);
    const hStep = size * 1.5;
    
    for (let y = 0; y < h + size; y += hStep) {
      for (let x = 0; x < w + size; x += wStep) {
        const offset = (Math.floor(y / hStep) % 2 === 0) ? 0 : wStep / 2;
        this.hexagons.push({
          x: x + offset,
          y: y,
          size: size,
          active: 0
        });
      }
    }
  }

  update(mouseX: number, mouseY: number) {
    this.hexagons.forEach(hex => {
      const dist = Math.hypot(hex.x - mouseX, hex.y - mouseY);
      if (dist < 100) hex.active = 1;
      if (hex.active > 0) hex.active -= 0.02;
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 1;
    this.hexagons.forEach(hex => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = hex.x + hex.size * Math.cos(angle);
        const hy = hex.y + hex.size * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      
      if (hex.active > 0) {
        ctx.fillStyle = `rgba(56, 189, 248, ${hex.active * 0.2})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(56, 189, 248, ${hex.active * 0.5})`;
      } else {
        ctx.strokeStyle = COLORS.hex;
      }
      ctx.stroke();
    });
  }
}

class Kernel {
  x: number; y: number; radius: number; health: number; angle: number; empRadius: number;
  constructor(w: number, h: number) {
    this.x = w / 2; this.y = h / 2;
    this.radius = 40;
    this.health = 100;
    this.angle = 0;
    this.empRadius = 0;
  }
  
  triggerEMP() { this.empRadius = 1; }

  update() {
    this.angle += 0.02;
    if (this.health < 100) this.health += 0.1;
    if (this.empRadius > 0) {
        this.empRadius += 15;
        if (this.empRadius > 1500) this.empRadius = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y);

    if (this.empRadius > 0) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(34, 211, 238, ${Math.max(0, 1 - this.empRadius/1000)})`;
        ctx.lineWidth = 50;
        ctx.arc(0, 0, this.empRadius, 0, Math.PI * 2); ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = this.health > 50 ? COLORS.coreShield : 'rgba(239, 68, 68, 0.4)';
    ctx.lineWidth = 2;
    ctx.arc(0, 0, this.radius + 15, 0, Math.PI * 2); ctx.stroke();
    
    ctx.rotate(this.angle);
    ctx.fillStyle = this.health > 50 ? COLORS.core : '#ef4444';
    ctx.fillRect(-20, -20, 40, 40);
    
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-30, -30); ctx.lineTo(-20, -20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, 30); ctx.lineTo(20, 20); ctx.stroke();

    ctx.restore();
  }
}

class Guardian {
  angle: number; distance: number; speed: number; cooldown: number; target: Virus | null;
  x: number; y: number;
  constructor(angleOffset: number) {
    this.angle = angleOffset;
    this.distance = 100;
    this.speed = 0.02;
    this.cooldown = 0;
    this.target = null;
    this.x = 0; this.y = 0;
  }

  update(cx: number, cy: number, viruses: Virus[]) {
    this.angle += this.speed;
    this.x = cx + Math.cos(this.angle) * this.distance;
    this.y = cy + Math.sin(this.angle) * this.distance;

    if (!this.target || this.target.dead) {
        let minDist = 300;
        this.target = null;
        viruses.forEach(v => {
            const d = Math.hypot(this.x - v.x, this.y - v.y);
            if (d < minDist) { minDist = d; this.target = v; }
        });
    }

    if (this.cooldown > 0) this.cooldown--;
    if (this.target && this.cooldown <= 0) {
        this.cooldown = 20;
        return new Laser(this.x, this.y, this.target.x, this.target.y);
    }
    return null;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI/2);
    
    ctx.fillStyle = COLORS.guardian;
    ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(8, 8); ctx.lineTo(0, 5); ctx.lineTo(-8, 8); ctx.fill();
    
    ctx.restore();
  }
}

class Virus {
  x: number; y: number; vx: number; vy: number; dead: boolean; hp: number;
  constructor(w: number, h: number) {
    this.dead = false; this.hp = 1;
    const side = Math.floor(Math.random() * 4);
    if (side === 0) { this.x = Math.random() * w; this.y = -20; }
    else if (side === 1) { this.x = w + 20; this.y = Math.random() * h; }
    else if (side === 2) { this.x = Math.random() * w; this.y = h + 20; }
    else { this.x = -20; this.y = Math.random() * h; }

    const angle = Math.atan2(h/2 - this.y, w/2 - this.x);
    const speed = 1 + Math.random() * 1.5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }

  update(cx: number, cy: number, empRadius: number, mouseX: number, mouseY: number) {
    const distCenter = Math.hypot(cx - this.x, cy - this.y);
    if (empRadius > 0 && Math.abs(distCenter - empRadius) < 50) {
        this.dead = true; return "EXPLODE";
    }

    if (distCenter < 50) {
        this.dead = true; return "HIT_CORE";
    }

    const distMouse = Math.hypot(mouseX - this.x, mouseY - this.y);
    if (distMouse < 100) {
        this.vx -= (mouseX - this.x) * 0.005;
        this.vy -= (mouseY - this.y) * 0.005;
    }

    this.vx += (Math.random()-0.5) * 0.1;
    this.vy += (Math.random()-0.5) * 0.1;

    this.x += this.vx; this.y += this.vy;
    return null;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(Date.now() * 0.01);
    ctx.fillStyle = COLORS.virus;
    ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(7, 4); ctx.lineTo(-7, 4); ctx.fill();
    ctx.restore();
  }
}

class Laser {
  x: number; y: number; tx: number; ty: number; life: number;
  constructor(x: number, y: number, tx: number, ty: number) {
    this.x = x; this.y = y; this.tx = tx; this.ty = ty;
    this.life = 10;
  }
  update() { this.life--; }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.life / 10;
    ctx.strokeStyle = COLORS.laser;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.tx, this.ty); ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

class Particle {
  x: number; y: number; vx: number; vy: number; life: number; color: string;
  constructor(x: number, y: number, color: string) {
    this.x = x; this.y = y;
    const a = Math.random() * Math.PI * 2; const s = Math.random() * 3;
    this.vx = Math.cos(a) * s; this.vy = Math.sin(a) * s;
    this.life = 1.0; this.color = color;
  }
  update() { this.x+=this.vx; this.y+=this.vy; this.life-=0.05; }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = Math.max(0, this.life); ctx.fillStyle = this.color;
    ctx.beginPath(); ctx.arc(this.x, this.y, 2, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1;
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
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
    this.draw(ctx, activeCategory);
  }

  draw(ctx: CanvasRenderingContext2D, activeFilter: string | null) {
    let alpha = 1;
    if (activeFilter && this.type !== activeFilter) {
      alpha = 0.1;
    }
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
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

const Background5 = () => {
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

    let width = window.innerWidth; let height = window.innerHeight;
    canvas.width = width; canvas.height = height;

    const grid = new HexGrid(width, height);
    const kernel = new Kernel(width, height);
    const guardians = [new Guardian(0), new Guardian(Math.PI*2/3), new Guardian(Math.PI*4/3)];
    let viruses: Virus[] = [];
    let lasers: Laser[] = [];
    let particles: Particle[] = [];
    
    const skills = [
      { text: "React", type: "frontend" }, { text: "Next.js", type: "frontend" },
      { text: "TypeScript", type: "frontend" }, { text: "Tailwind", type: "frontend" },
      { text: "Node.js", type: "backend" }, { text: "MongoDB", type: "backend" },
      { text: "Docker", type: "backend" }, { text: "AWS", type: "future" },
      { text: "Figma", type: "creative" }, { text: "Three.js", type: "creative" },
      { text: "Rust", type: "future" }, { text: "AI/ML", type: "future" },
    ];
    let skillOrbs: SkillParticle[] = skills.map((s, i) => new SkillParticle(s, i, width, height));
    
    let isMouseDown = false;
    let mouseX = 0, mouseY = 0, lastMouseX = 0, lastMouseY = 0, mouseSpeed = 0;
    let frame = 0;
    let animationId: number;

    const resize = () => {
        width = window.innerWidth; height = window.innerHeight;
        canvas.width = width; canvas.height = height;
        kernel.x = width/2; kernel.y = height/2;
    };
    window.addEventListener('resize', resize);
    window.addEventListener('mousedown', () => isMouseDown = true);
    window.addEventListener('mouseup', () => isMouseDown = false);
    window.addEventListener('mousemove', (e) => { 
      mouseX = e.clientX; mouseY = e.clientY; 
      const dist = Math.sqrt(Math.pow(mouseX - lastMouseX, 2) + Math.pow(mouseY - lastMouseY, 2));
      mouseSpeed = dist; lastMouseX = mouseX; lastMouseY = mouseY;
    });
    window.addEventListener('click', () => kernel.triggerEMP());

    const animate = () => {
      frame++;
      ctx.fillStyle = 'rgba(2, 6, 23, 0.4)';
      ctx.fillRect(0, 0, width, height);

      grid.update(mouseX, mouseY);
      grid.draw(ctx);

      kernel.update();
      kernel.draw(ctx);

      if (frame % 30 === 0 && viruses.length < 20) viruses.push(new Virus(width, height));

      guardians.forEach(g => {
          const shot = g.update(kernel.x, kernel.y, viruses);
          if (shot) {
              lasers.push(shot);
              if(g.target) {
                  g.target.hp--;
                  if(g.target.hp <= 0) {
                      g.target.dead = true;
                      for(let i=0;i<5;i++) particles.push(new Particle(g.target.x, g.target.y, COLORS.virus));
                  }
              }
          }
          g.draw(ctx);
      });

      viruses.forEach(v => {
          const status = v.update(kernel.x, kernel.y, kernel.empRadius, mouseX, mouseY);
          if (status === "EXPLODE") {
              for(let i=0;i<8;i++) particles.push(new Particle(v.x, v.y, COLORS.virus));
          } else if (status === "HIT_CORE") {
              kernel.health -= 5;
              for(let i=0;i<5;i++) particles.push(new Particle(v.x, v.y, '#fff'));
          }
          v.draw(ctx);
      });
      viruses = viruses.filter(v => !v.dead);

      lasers.forEach(l => { l.update(); l.draw(ctx); });
      lasers = lasers.filter(l => l.life > 0);

      particles.forEach(p => { p.update(); p.draw(ctx); });
      particles = particles.filter(p => p.life > 0);

      skillOrbs.forEach(orb => {
          orb.update(ctx, mouseX, mouseY, mouseSpeed, filterRef.current, frame, width, height, isMouseDown);
      });
      mouseSpeed *= 0.9;

      if (kernel.health < 100) {
          ctx.font = "bold 14px monospace";
          ctx.fillStyle = kernel.health < 30 ? "#ef4444" : "#3b82f6";
          ctx.fillText(`CORE INTEGRITY: ${Math.floor(kernel.health)}%`, kernel.x - 70, kernel.y + 70);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => { 
        window.removeEventListener('resize', resize);
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
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-auto" />
      <div className="fixed bottom-10 left-10 z-10 text-slate-500 text-xs font-mono pointer-events-none hidden md:block select-none">
         <p className="text-blue-400">DEFENSE_PROTOCOL: ACTIVE</p>
         <p>MOUSE: DEFLECTOR SHIELD</p>
         <p>CLICK: EMP BLAST</p>
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

export default Background5;