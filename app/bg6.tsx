import { useEffect, useRef } from "react";

const COLORS = {
  frontend: '#22d3ee',
  backend: '#34d399',
  creative: '#c084fc',
  future: '#ffffff'
};
const SaiyanBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // State to track power level (Yellow vs Blue)
  const isCharging = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    // Input listeners for "Charging" effect
    const startCharge = () => isCharging.current = true;
    const endCharge = () => isCharging.current = false;
    
    window.addEventListener("resize", resize);
    window.addEventListener("mousedown", startCharge);
    window.addEventListener("mouseup", endCharge);
    window.addEventListener("touchstart", startCharge);
    window.addEventListener("touchend", endCharge);
    
    resize();

    // --- CLASSES ---

    class KiParticle {
      x: number; y: number; size: number; speedY: number; speedX: number; color: string; life: number;
      constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100; // Start below screen
        this.size = Math.random() * 5 + 2;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 2;
        this.life = 1;
        // Randomly Gold or White initially
        this.color = Math.random() > 0.5 ? "#fbbf24" : "#ffffff"; 
      }

      update() {
        // If charging, turn BLUE and go FASTER
        if (isCharging.current) {
           this.speedY += 0.5; // Accelerate
           this.color = Math.random() > 0.5 ? "#22d3ee" : "#ffffff"; // Cyan/White
        } else {
           // Return to Gold logic
           this.color = Math.random() > 0.5 ? "#fbbf24" : "#f59e0b"; // Amber/Gold
        }

        this.y -= this.speedY;
        this.x += Math.sin(this.y * 0.01) + this.speedX; // Wavy rising path
        this.life -= 0.005;

        if (this.y < -50 || this.life <= 0) {
          this.y = height + 10;
          this.x = Math.random() * width;
          this.life = 1;
          this.speedY = Math.random() * 3 + 2;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        
        // Draw Energy Spark (Rectangles look more "anime speed" than circles)
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.size, this.size * 3); // Stretched vertically
        ctx.fill();
        
        ctx.globalAlpha = 1;
      }
    }

    class Lightning {
      x: number; y: number; points: {x:number, y:number}[]; life: number; color: string;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.life = 0;
        this.points = [];
        this.color = isCharging.current ? "#22d3ee" : "#fbbf24"; // Cyan or Gold
      }
      
      strike() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.life = 1.0;
        this.points = [{x: this.x, y: this.y}];
        let currX = this.x;
        let currY = this.y;
        
        // Create jagged path
        for(let i=0; i<10; i++) {
           currX += (Math.random() - 0.5) * 100;
           currY += (Math.random() - 0.5) * 100;
           this.points.push({x: currX, y: currY});
        }
      }

      update() {
        if (this.life > 0) this.life -= 0.1;
        // Randomly trigger lightning (more often when charging)
        const chance = isCharging.current ? 0.05 : 0.01;
        if (this.life <= 0 && Math.random() < chance) {
           this.strike();
        }
      }

      draw() {
        if (!ctx || this.life <= 0) return;
        
        ctx.strokeStyle = isCharging.current ? "#a5f3fc" : "#fde68a"; // Light cyan or light yellow
        ctx.lineWidth = 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = isCharging.current ? "#22d3ee" : "#fbbf24";
        ctx.globalAlpha = this.life;
        
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for(let i=1; i<this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }

    class DragonBall {
      x: number; y: number; stars: number; floatOffset: number;
      constructor(i: number) {
        // Spread 7 balls across the screen
        this.x = (width / 8) * (i + 1);
        this.y = height / 2 + (Math.random() - 0.5) * 200;
        this.stars = i + 1;
        this.floatOffset = Math.random() * 100;
      }
      
      update() {
        // Gentle floating
        this.y += Math.sin((time + this.floatOffset) * 0.02) * 0.5;
      }
      
      draw() {
        if(!ctx) return;
        // Ball
        const grad = ctx.createRadialGradient(this.x - 5, this.y - 5, 2, this.x, this.y, 20);
        grad.addColorStop(0, "#fcd34d"); // Light orange
        grad.addColorStop(1, "#f97316"); // Dark orange
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(this.x, this.y, 20, 0, Math.PI*2); ctx.fill();
        
        // Stars (Red dots inside)
        ctx.fillStyle = "#ef4444";
        // Simple representation of stars (just dots)
        for(let i=0; i<this.stars; i++) {
           const angle = (i / this.stars) * Math.PI * 2;
           ctx.beginPath(); 
           ctx.arc(this.x + Math.cos(angle)*8, this.y + Math.sin(angle)*8, 2, 0, Math.PI*2); 
           ctx.fill();
        }
      }
    }

    // --- INIT ---
    const particles: KiParticle[] = Array.from({ length: 100 }, () => new KiParticle());
    const lightnings: Lightning[] = Array.from({ length: 3 }, () => new Lightning());
    const dragonBalls: DragonBall[] = Array.from({ length: 7 }, (_, i) => new DragonBall(i));

    // --- ANIMATE ---
    const animate = () => {
      if (!ctx) return;
      time++;
      
      // Clear & Background (Dark Void)
      // When charging, background gets brighter
      const bgOpacity = isCharging.current ? 0.3 : 0.1;
      ctx.fillStyle = `rgba(10, 10, 10, ${bgOpacity})`; 
      ctx.fillRect(0, 0, width, height); // Use fillRect with opacity for trail effect

      // Draw Dragon Balls (Background Layer)
      dragonBalls.forEach(db => { db.update(); db.draw(); });

      // Draw Particles (Ki)
      particles.forEach(p => { p.update(); p.draw(); });

      // Draw Lightning
      lightnings.forEach(l => { l.update(); l.draw(); });
      
      // Draw Floor Glow (Aura Source)
      const glowColor = isCharging.current ? "rgba(34, 211, 238, 0.2)" : "rgba(251, 191, 36, 0.2)";
      const grad = ctx.createRadialGradient(width/2, height, 50, width/2, height, 600);
      grad.addColorStop(0, glowColor);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousedown", startCharge);
      window.removeEventListener("mouseup", endCharge);
      window.removeEventListener("touchstart", startCharge);
      window.removeEventListener("touchend", endCharge);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
};
export default SaiyanBackground;