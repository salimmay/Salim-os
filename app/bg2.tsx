// bg2.tsx
"use client";

import React, { useRef, useState, useEffect } from 'react';

// --- CONFIG ---
const COLORS = {
  frontend: '#22d3ee',
  backend: '#34d399',
  creative: '#c084fc',
  future: '#ffffff',
  explosion: ['#ef4444', '#f59e0b', '#ffffff', '#7dd3fc']
};

// --- CLASSES ---

class Star {
  x: number; y: number; size: number; alpha: number;
  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 1.5;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill();
  }
}

class Explosion {
  x: number; y: number; particles: any[]; dead: boolean;
  constructor(x: number, y: number) {
    this.x = x; this.y = y; this.dead = false; this.particles = [];
    for(let i=0; i<25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      this.particles.push({
        x: 0, y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color: COLORS.explosion[Math.floor(Math.random() * COLORS.explosion.length)],
        size: Math.random() * 3 + 1
      });
    }
  }
  update() {
    let active = false;
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.life -= 0.02;
      p.vx *= 0.95; p.vy *= 0.95;
      if(p.life > 0) active = true;
    });
    if(!active) this.dead = true;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    this.particles.forEach(p => {
      if(p.life <= 0) return;
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
    });
    ctx.restore();
  }
}

class Rocket {
  x: number; y: number; vx: number; vy: number; 
  size: number; angle: number; dead: boolean; type: number;
  
  constructor(w: number, h: number) {
    this.dead = false;
    this.size = 15;
    this.type = Math.random() > 0.5 ? 1 : 2;

    if (Math.random() < 0.5) {
      this.x = Math.random() < 0.5 ? -50 : w + 50;
      this.y = Math.random() * h;
    } else {
      this.x = Math.random() * w;
      this.y = Math.random() < 0.5 ? -50 : h + 50;
    }

    const targetX = w/2 + (Math.random() - 0.5) * w * 0.5;
    const targetY = h/2 + (Math.random() - 0.5) * h * 0.5;
    this.angle = Math.atan2(targetY - this.y, targetX - this.x);
    
    const speed = Math.random() * 2 + 1.5;
    this.vx = Math.cos(this.angle) * speed;
    this.vy = Math.sin(this.angle) * speed;
  }

  update(w: number, h: number) {
    this.x += this.vx; this.y += this.vy;
    if (this.x < -100 || this.x > w+100 || this.y < -100 || this.y > h+100) this.dead = true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.fillStyle = this.type === 1 ? '#cbd5e1' : '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 6, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(-10, -6); ctx.lineTo(-15, -12); ctx.lineTo(-5, -6);
    ctx.moveTo(-10, 6); ctx.lineTo(-15, 12); ctx.lineTo(-5, 6);
    ctx.fill();

    ctx.fillStyle = Math.random() > 0.5 ? '#f59e0b' : '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-15, -3);
    ctx.lineTo(-25 - Math.random() * 10, 0);
    ctx.lineTo(-15, 3);
    ctx.fill();

    ctx.restore();
  }
}

class Satellite {
  x: number; y: number; angle: number;
  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.angle = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += Math.cos(this.angle) * 0.2;
    this.y += Math.sin(this.angle) * 0.2;
    this.angle += 0.001;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle * 0.5);
    
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    
    ctx.fillRect(-40, -10, 30, 20);
    ctx.strokeRect(-40, -10, 30, 20);
    ctx.beginPath(); ctx.moveTo(-25, -10); ctx.lineTo(-25, 10); ctx.stroke();
    
    ctx.fillRect(10, -10, 30, 20);
    ctx.strokeRect(10, -10, 30, 20);
    ctx.beginPath(); ctx.moveTo(25, -10); ctx.lineTo(25, 10); ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill();
    if(Math.floor(Date.now() / 500) % 2 === 0) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI*2); ctx.fill();
    }

    ctx.restore();
  }
}

class Planet {
  x: number; y: number; radius: number; color: string; hasRing: boolean;
  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.radius = Math.random() * 40 + 20;
    this.color = Math.random() > 0.5 ? '#4c1d95' : '#0f766e';
    this.hasRing = Math.random() > 0.5;
  }
  update() {
    this.x += 0.05; 
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    if(this.hasRing) {
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radius * 2, this.radius * 0.6, -0.2, Math.PI, 0); 
        ctx.stroke();
    }

    const g = ctx.createRadialGradient(-10, -10, 0, 0, 0, this.radius);
    g.addColorStop(0, this.color);
    g.addColorStop(1, '#020617');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI*2); ctx.fill();

    if(this.hasRing) {
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radius * 2, this.radius * 0.6, -0.2, 0, Math.PI); 
        ctx.stroke();
    }
    ctx.restore();
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
    const c = COLORS[this.type as keyof typeof COLORS];
    this.color = typeof c === 'string' ? c : '#fff';
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
    if (this.x + this.size > w+200 || this.x - this.size < -200) this.vx = -this.vx;
    if (this.y + this.size > h+200 || this.y - this.size < -200) this.vy = -this.vy;
    this.draw(ctx, activeCategory, mouseX, mouseY);
  }

  draw(ctx: CanvasRenderingContext2D, activeCategory: string | null, mouseX: number, mouseY: number) {
    let alpha = 1; if (activeCategory && this.type !== activeCategory) alpha = 0.1;
    ctx.globalAlpha = alpha;
    ctx.font = `bold ${this.size}px monospace`;
    if (this.type === 'future') {
      ctx.strokeStyle = this.color; ctx.lineWidth = 1; ctx.strokeText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = this.color; ctx.fillText(this.text, this.x, this.y);
    }
    ctx.globalAlpha = 1;

    const d = Math.hypot(mouseX - this.x, mouseY - this.y);
    if(d < 120 && (!activeCategory || this.type === activeCategory)) {
      ctx.beginPath(); ctx.strokeStyle = this.color; ctx.lineWidth = 0.5;
      ctx.moveTo(this.x, this.y); ctx.lineTo(mouseX, mouseY); ctx.stroke();
    }
  }
}

// --- MAIN COMPONENT ---

const Background2 = () => {
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

    let stars: Star[] = [];
    let rockets: Rocket[] = [];
    let explosions: Explosion[] = [];
    let satellites: Satellite[] = [];
    let planets: Planet[] = [];
    let particles: SkillParticle[] = [];

    const allSkills = [
      { text: "React", type: "frontend" }, { text: "Next.js", type: "frontend" },
      { text: "TypeScript", type: "frontend" }, { text: "Tailwind", type: "frontend" },
      { text: "Node.js", type: "backend" }, { text: "MongoDB", type: "backend" },
      { text: "Docker", type: "backend" }, { text: "AWS", type: "future" },
      { text: "Figma", type: "creative" }, { text: "Three.js", type: "creative" },
      { text: "Rust", type: "future" }, { text: "AI/ML", type: "future" },
    ];

    let animationId: number;
    let mouseX = 0, mouseY = 0, lastMouseX = 0, lastMouseY = 0, mouseSpeed = 0;
    let isMouseDown = false;
    let time = 0;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 100 }, () => new Star(canvas.width, canvas.height));
      satellites = Array.from({ length: 3 }, () => new Satellite(canvas.width, canvas.height));
      planets = Array.from({ length: 2 }, () => new Planet(canvas.width, canvas.height));
      particles = allSkills.map((s, i) => new SkillParticle(s, i, canvas.width, canvas.height));
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousedown', () => isMouseDown = true);
    window.addEventListener('mouseup', () => isMouseDown = false);
    window.addEventListener('mousemove', (e) => { 
      mouseX = e.clientX; mouseY = e.clientY; 
      const dist = Math.sqrt(Math.pow(mouseX - lastMouseX, 2) + Math.pow(mouseY - lastMouseY, 2));
      mouseSpeed = dist; lastMouseX = mouseX; lastMouseY = mouseY;
    });
    init();

    const animate = () => {
      time++;
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      g.addColorStop(0, '#020617'); g.addColorStop(1, '#1e293b');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => s.draw(ctx));
      planets.forEach(p => { p.update(); p.draw(ctx); });
      satellites.forEach(s => { s.update(); s.draw(ctx); });

      if (rockets.length < 6 && Math.random() < 0.05) {
        rockets.push(new Rocket(canvas.width, canvas.height));
      }

      for (let i = 0; i < rockets.length; i++) {
        const r1 = rockets[i];
        r1.update(canvas.width, canvas.height);
        r1.draw(ctx);

        for (let j = i + 1; j < rockets.length; j++) {
          const r2 = rockets[j];
          if (r1.dead || r2.dead) continue;

          const dist = Math.hypot(r1.x - r2.x, r1.y - r2.y);
          if (dist < r1.size + r2.size) {
            r1.dead = true;
            r2.dead = true;
            explosions.push(new Explosion((r1.x + r2.x) / 2, (r1.y + r2.y) / 2));
          }
        }
      }
      rockets = rockets.filter(r => !r.dead);

      explosions.forEach(ex => { ex.update(); ex.draw(ctx); });
      explosions = explosions.filter(ex => !ex.dead);

      particles.forEach(p => p.update(ctx, mouseX, mouseY, mouseSpeed, filterRef.current, time, canvas.width, canvas.height, isMouseDown));
      mouseSpeed *= 0.9;

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => { 
        window.removeEventListener('resize', init); 
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

export default Background2;