"use client";

import React, { useRef, useState, useEffect } from 'react';

const COLORS: any = {
  frontend: '#22d3ee', 
  backend: '#34d399',  
  creative: '#c084fc', 
  future: '#ffffff'
};

// --- SHARED CLASSES ---

class ShootingStar {
  x: number; y: number; length: number; speed: number; angle: number; dead: boolean; opacity: number;
  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.length = Math.random() * 80 + 20;
    this.speed = Math.random() * 10 + 5;
    this.angle = Math.PI / 4;
    this.dead = false;
    this.opacity = 1;
  }
  update(w: number, h: number) {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.opacity -= 0.01;
    if (this.opacity <= 0 || this.x > w || this.y > h) this.dead = true;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
    ctx.stroke();
    ctx.restore();
  }
}

class Explosion {
  x: number; y: number; particles: any[]; dead: boolean;
  constructor(x: number, y: number) {
    this.x = x; this.y = y; this.dead = false; this.particles = [];
    for(let i=0; i<20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3;
      this.particles.push({ 
        x: 0, y: 0, 
        vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, 
        life: 1.0, 
        color: ['#ef4444', '#f59e0b', '#ffffff'][Math.floor(Math.random()*3)] 
      });
    }
  }
  update() {
    let alive = false;
    this.particles.forEach(p => { 
      p.x+=p.vx; p.y+=p.vy; p.life-=0.02; 
      if(p.life>0) alive=true; 
    });
    if(!alive) this.dead = true;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y);
    this.particles.forEach(p => { 
      if(p.life>0) { 
        ctx.globalAlpha=p.life; ctx.fillStyle=p.color; 
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill(); 
      } 
    });
    ctx.restore();
  }
}

class Rocket {
  x: number; y: number; vx: number; vy: number; dead: boolean;
  constructor(w: number, h: number) {
    this.dead = false;
    const side = Math.floor(Math.random() * 4);
    if (side === 0) { this.x = Math.random() * w; this.y = -50; }
    else if (side === 1) { this.x = w + 50; this.y = Math.random() * h; }
    else if (side === 2) { this.x = Math.random() * w; this.y = h + 50; }
    else { this.x = -50; this.y = Math.random() * h; }
    
    const targetX = (w/2) + (Math.random()-0.5)*w;
    const targetY = (h/2) + (Math.random()-0.5)*h;
    const angle = Math.atan2(targetY - this.y, targetX - this.x);
    const speed = 1 + Math.random() * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }
  update(isMouseDown: boolean, mouseX: number, mouseY: number, w: number, h: number) {
    if (isMouseDown) {
       const dx = mouseX - this.x; const dy = mouseY - this.y; 
       const dist = Math.sqrt(dx*dx + dy*dy);
       if (dist > 10) { this.vx += (dx/dist) * 0.5; this.vy += (dy/dist) * 0.5; }
    }
    this.x += this.vx; this.y += this.vy;
    if (this.x < -100 || this.x > w + 100 || this.y < -100 || this.y > h + 100) this.dead = true;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(Math.atan2(this.vy, this.vx));
    ctx.fillStyle = '#cbd5e1'; ctx.beginPath(); ctx.ellipse(0, 0, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.moveTo(-12, -2); ctx.lineTo(-20 - Math.random() * 5, 0); ctx.lineTo(-12, 2); ctx.fill();
    ctx.restore();
  }
}

class Astronaut {
  x: number; y: number; angle: number;
  constructor(w: number, h: number) {
    this.x = w / 2; this.y = h / 2; this.angle = 0;
  }
  update(mouseX: number, mouseY: number, time: number) {
    this.x += (mouseX - this.x) * 0.02; 
    this.y += (mouseY - this.y) * 0.02;
    this.y += Math.sin(time * 0.05) * 0.5; 
    this.angle = (mouseX - this.x) * 0.001; 
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle); ctx.scale(0.8, 0.8);
    // Backpack
    ctx.fillStyle = '#94a3b8'; ctx.fillRect(-25, -20, 50, 60);
    // Suit
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(-20, -15, 40, 50, 10); ctx.fill();
    // Helmet
    ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.arc(0, -25, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, -25, 18, 0, Math.PI * 2); ctx.fill();
    // Visor
    const gradient = ctx.createLinearGradient(-10, -35, 10, -15);
    gradient.addColorStop(0, '#3b82f6'); gradient.addColorStop(1, '#1e3a8a');
    ctx.fillStyle = gradient; ctx.beginPath(); ctx.ellipse(0, -25, 14, 10, 0, 0, Math.PI * 2); ctx.fill();
    // Glint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; ctx.beginPath(); ctx.ellipse(-5, -28, 3, 1.5, -0.2, 0, Math.PI * 2); ctx.fill();
    // Chest
    ctx.fillStyle = '#cbd5e1'; ctx.fillRect(-10, 5, 20, 12);
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(-4, 11, 2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(4, 11, 2, 0, Math.PI*2); ctx.fill();
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
    this.text = data.text;
    this.type = data.type;
    this.size = data.type === 'future' ? 12 : 14 + Math.random() * 6;
    this.exploded = false;
    this.color = COLORS[this.type as keyof typeof COLORS];
  }

  update(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number, mouseSpeed: number, activeCategory: string | null, time: number, w: number, h: number, isMouseDown: boolean) {
    // VORTEX MODE
    if (activeCategory) {
       if (this.type === activeCategory) {
         const centerX = w / 2; const centerY = h / 2;
         const angle = (time * 0.05) + (this.id * 0.5);
         const radius = 150 + Math.sin(time * 0.1 + this.id) * 30;
         const targetX = centerX + Math.cos(angle) * radius;
         const targetY = centerY + Math.sin(angle) * radius;
         this.x += (targetX - this.x) * 0.1;
         this.y += (targetY - this.y) * 0.1;
       } else {
         // Push away others
         const dx = this.x - w/2; const dy = this.y - h/2;
         this.vx += dx * 0.0005; this.vy += dy * 0.0005;
         this.x += this.vx; this.y += this.vy;
       }
    } 
    // NORMAL MODE
    else {
        if (!this.exploded) {
           this.vx *= 0.95; this.vy *= 0.95;
           if (Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1) this.exploded = true;
        } else {
            this.vx *= 0.99; this.vy *= 0.99;
            // Roam logic
            if (Math.abs(this.vx) < 0.2) this.vx += (Math.random() - 0.5) * 0.2;
            if (Math.abs(this.vy) < 0.2) this.vy += (Math.random() - 0.5) * 0.2;
        }

        // MOUSE REPULSION
        const dx = mouseX - this.x; const dy = mouseY - this.y; const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (isMouseDown) {
            // Black Hole Pull
            this.vx += (dx / dist) * 0.5; this.vy += (dy / dist) * 0.5;
        } else {
            // Gentle Push
            if (dist < 150) {
               const force = (150 - dist) / 150;
               this.vx -= (dx/dist) * force * 2;
               this.vy -= (dy/dist) * force * 2;
            }
        }
        this.x += this.vx; this.y += this.vy;
    }

    // Wall Bounce
    if (this.x + this.size > w+100 || this.x - this.size < -100) this.vx = -this.vx;
    if (this.y + this.size > h+100 || this.y - this.size < -100) this.vy = -this.vy;

    this.draw(ctx, activeCategory);
  }

  draw(ctx: CanvasRenderingContext2D, activeCategory: string | null) {
    let alpha = 1;
    if (activeCategory && this.type !== activeCategory) alpha = 0.1;
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

export const PhysicsOverlay = () => {
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
      { text: "Linux", type: "backend" }, { text: "Docker", type: "backend" },
      { text: "Photoshop", type: "creative" }, { text: "Lightroom", type: "creative" },
      { text: "AWS", type: "future" }, { text: "Rust", type: "future" },
      { text: "AI", type: "future" }, { text: "Figma", type: "creative" },
    ];

    let particles: SkillParticle[] = [];
    let rockets: Rocket[] = [];
    let explosions: Explosion[] = [];
    let shootingStars: ShootingStar[] = [];
    let trailParticles: any[] = [];
    let astronaut: Astronaut;
    
    let animationFrameId: number;
    let isMouseDown = false;
    let time = 0;
    let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
    let droneX = mouseX, droneY = mouseY;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousedown', () => isMouseDown = true);
    window.addEventListener('mouseup', () => isMouseDown = false);
    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    resizeCanvas();

    // Init
    const init = () => {
      particles = allSkills.map((s, i) => new SkillParticle(s, i, canvas.width, canvas.height));
      rockets = Array.from({length: 5}, () => new Rocket(canvas.width, canvas.height));
      astronaut = new Astronaut(canvas.width, canvas.height);
    };
    init();

    // Drone Draw
    const drawDrone = () => {
        // Interpolate
        droneX += (mouseX - droneX) * 0.08;
        droneY += (mouseY - droneY) * 0.08;
        ctx.save();
        ctx.translate(droneX, droneY);
        ctx.shadowBlur = 15; ctx.shadowColor = '#22d3ee';
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 12, 0 + time*0.15, Math.PI + time*0.15); ctx.stroke();
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI*2); ctx.fill();
        ctx.restore();
    };

    const animate = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear for transparency

      // Shooting Stars
      if (Math.random() < 0.02) shootingStars.push(new ShootingStar(canvas.width, canvas.height));
      shootingStars.forEach((s, i) => { s.update(canvas.width, canvas.height); s.draw(ctx); if (s.dead) shootingStars.splice(i, 1); });

      // Rockets & Explosions
      if (rockets.length < 5 && Math.random() < 0.05) rockets.push(new Rocket(canvas.width, canvas.height));
      rockets.forEach((r, i) => { r.update(isMouseDown, mouseX, mouseY, canvas.width, canvas.height); r.draw(ctx); if (r.dead) rockets.splice(i, 1); });
      
      for (let i=0; i<rockets.length; i++) {
        for (let j=i+1; j<rockets.length; j++) {
             const d = Math.sqrt(Math.pow(rockets[i].x-rockets[j].x,2)+Math.pow(rockets[i].y-rockets[j].y,2));
             if(d<30) { 
                 explosions.push(new Explosion((rockets[i].x+rockets[j].x)/2, (rockets[i].y+rockets[j].y)/2)); 
                 rockets[i].dead=true; rockets[j].dead=true; 
             }
        }
      }
      explosions.forEach((ex, i) => { ex.update(); ex.draw(ctx); if(ex.dead) explosions.splice(i, 1); });

      // Astronaut
      if(astronaut) { astronaut.update(mouseX, mouseY, time); astronaut.draw(ctx); }

      // Drone
      drawDrone();

      // Skills
      particles.forEach(p => p.update(ctx, mouseX, mouseY, 0, filterRef.current, time, canvas.width, canvas.height, isMouseDown));
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => { 
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationFrameId); 
    };
  }, []);

  const LegendItem = ({ color, label, type }: any) => {
    const isActive = activeFilter === type;
    return (
      <div onClick={() => handleFilterClick(type)} className={`flex items-center gap-2 cursor-pointer p-1.5 rounded transition-all duration-300 ${isActive ? 'bg-white/10 scale-105' : 'hover:bg-white/5'} opacity-100`}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: isActive ? `0 0 12px ${color}` : 'none' }}></div>
        <span className={`text-slate-300 font-medium ${isActive ? 'text-white' : ''}`}>{label}</span>
      </div>
    );
  };

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-auto" />
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