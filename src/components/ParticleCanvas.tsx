import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  alphaDir: number;
  hue: number;
  life: number;
  maxLife: number;
  trail: { x: number; y: number }[];
  type: 'ember' | 'spark' | 'orb';
}

interface Props {
  intensity?: 'low' | 'medium' | 'high';
  goldMode?: boolean;
}

export default function ParticleCanvas({ intensity = 'low', goldMode = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const counts = { low: 30, medium: 55, high: 100 };
    const count = counts[intensity];

    const createParticle = (forceType?: Particle['type']): Particle => {
      const types: Particle['type'][] = ['ember', 'ember', 'ember', 'spark', 'orb'];
      const type = forceType || types[Math.floor(Math.random() * types.length)];

      const baseSpeed = intensity === 'high' ? 0.8 : intensity === 'medium' ? 0.5 : 0.35;

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * baseSpeed,
        vy: type === 'ember' ? -Math.random() * baseSpeed - 0.2 : (Math.random() - 0.5) * baseSpeed * 0.5,
        radius: type === 'orb' ? Math.random() * 5 + 3 : type === 'spark' ? Math.random() * 1.5 + 0.5 : Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.5 + 0.15,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        hue: goldMode ? 40 + Math.random() * 20 : 12 + Math.random() * 28,
        life: 0,
        maxLife: type === 'spark' ? 100 + Math.random() * 150 : 200 + Math.random() * 400,
        trail: [],
        type,
      };
    };

    particlesRef.current = Array.from({ length: count }, () => createParticle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];

        // Store trail for sparks
        if (p.type === 'spark') {
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 8) p.trail.shift();
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Slight wind/drift
        p.vx += (Math.random() - 0.5) * 0.02;

        p.alpha += p.alphaDir * 0.005;
        if (p.alpha > 0.7) p.alphaDir = -1;
        if (p.alpha < 0.1) p.alphaDir = 1;

        if (p.life > p.maxLife || p.y < -20 || p.x < -20 || p.x > canvas.width + 20) {
          particlesRef.current[i] = createParticle();
          particlesRef.current[i].y = canvas.height + Math.random() * 20;
          continue;
        }

        const sat = goldMode ? '85%' : '100%';
        const light = goldMode ? '55%' : '50%';
        const baseColor = `hsla(${p.hue}, ${sat}, ${light}`;

        if (p.type === 'spark' && p.trail.length > 1) {
          // Draw trail
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) {
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
          }
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `${baseColor}, ${p.alpha * 0.3})`;
          ctx.lineWidth = p.radius * 0.8;
          ctx.stroke();
        }

        // Main particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor}, ${p.alpha})`;
        ctx.fill();

        // Glow — bigger for orbs
        const glowMultiplier = p.type === 'orb' ? 6 : 3.5;
        const glowAlpha = p.type === 'orb' ? p.alpha * 0.1 : p.alpha * 0.08;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * glowMultiplier, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor}, ${glowAlpha})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [intensity, goldMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
