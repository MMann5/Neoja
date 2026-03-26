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

    const count = intensity === 'high' ? 80 : intensity === 'medium' ? 45 : 20;

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.15,
      radius: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.1,
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      // Orange/amber range for default, gold for goldMode
      hue: goldMode ? 42 + Math.random() * 15 : 15 + Math.random() * 25,
      life: 0,
      maxLife: 250 + Math.random() * 350,
    });

    particlesRef.current = Array.from({ length: count }, createParticle);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        p.alpha += p.alphaDir * 0.006;
        if (p.alpha > 0.7) p.alphaDir = -1;
        if (p.alpha < 0.1) p.alphaDir = 1;

        if (p.life > p.maxLife || p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
          particlesRef.current[i] = createParticle();
          particlesRef.current[i].y = canvas.height + 10;
          continue;
        }

        const sat = goldMode ? '80%' : '100%';
        const light = goldMode ? '55%' : '50%';

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${sat}, ${light}, ${p.alpha})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${sat}, ${light}, ${p.alpha * 0.12})`;
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
