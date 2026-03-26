import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import type { Contestant } from '../data/contestants';
import { useAudio } from '../hooks/useAudio';
import confetti from 'canvas-confetti';

interface Props {
  contestant: Contestant;
}

const rankLabels: Record<number, string> = {
  1: '🏆 CHAMPION',
  2: '🥈 SECOND PLACE',
  3: '🥉 THIRD PLACE',
};

const rankColors: Record<number, { glow: string; accent: string; textClass: string }> = {
  1: {
    glow: 'rgba(255,215,0,0.4)',
    accent: '#ffd700',
    textClass: 'gold-shimmer-text',
  },
  2: {
    glow: 'rgba(192,216,240,0.25)',
    accent: '#c0d8f0',
    textClass: '',
  },
  3: {
    glow: 'rgba(205,127,50,0.25)',
    accent: '#cd7f32',
    textClass: '',
  },
};

export default function PlacementReveal({ contestant }: Props) {
  const { playRevealSting } = useAudio();
  const fxDone = useRef(false);

  const colors = rankColors[contestant.rank];

  useEffect(() => {
    if (fxDone.current) return;
    fxDone.current = true;

    playRevealSting(contestant.rank);

    if (contestant.rank === 1) {
      const flash = document.createElement('div');
      flash.style.cssText = `
        position:fixed;inset:0;z-index:200;
        background:radial-gradient(circle, rgba(255,215,0,0.7) 0%, rgba(255,107,0,0.3) 40%, rgba(255,215,0,0) 70%);
        animation:gold-flash 1.2s ease-out forwards;
        pointer-events:none;
      `;
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 1500);

      const root = document.getElementById('root');
      if (root) {
        root.classList.add('shake');
        setTimeout(() => root.classList.remove('shake'), 600);
      }

      setTimeout(() => {
        const cols = ['#FFD700', '#FF6B00', '#FFF1C1', '#FF8C2A', '#FFD100'];
        confetti({ particleCount: 180, spread: 120, origin: { y: 0.45, x: 0.5 }, colors: cols, ticks: 200, gravity: 0.5, scalar: 1.3 });
        setTimeout(() => {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.5, x: 0.25 }, colors: cols, ticks: 160 });
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.5, x: 0.75 }, colors: cols, ticks: 160 });
        }, 400);
      }, 350);
    }

    return () => { fxDone.current = false; };
  }, [contestant.rank, playRevealSting]);

  const cardBorderClass = contestant.rank === 1
    ? 'card-border-gold'
    : contestant.rank === 2
      ? 'card-border-silver'
      : 'card-border-bronze';

  // Simple, reliable entrance per rank
  const entrance = contestant.rank === 1
    ? { initial: { opacity: 0, y: 200, scale: 0.6 }, animate: { opacity: 1, y: 0, scale: 1 } }
    : contestant.rank === 2
      ? { initial: { opacity: 0, x: -250 }, animate: { opacity: 1, x: 0 } }
      : { initial: { opacity: 0, y: 100 }, animate: { opacity: 1, y: 0 } };

  return (
    <motion.div
      key={`reveal-${contestant.rank}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center court-gradient z-40"
    >
      <div className="court-lines" />

      {/* Background glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 65%)`,
          filter: 'blur(80px)',
        }}
      />

      {/* Shockwave for 1st */}
      {contestant.rank === 1 && (
        <div
          className="absolute w-4 h-4 rounded-full pointer-events-none"
          style={{ animation: 'shockwave 1.5s ease-out 0.2s forwards' }}
        />
      )}

      {/* Card entrance */}
      <motion.div
        initial={entrance.initial}
        animate={entrance.animate}
        transition={{
          duration: contestant.rank === 1 ? 1.2 : 0.8,
          ease: [0.22, 1, 0.36, 1],
          ...(contestant.rank === 1 ? { scale: { type: 'spring', stiffness: 80, damping: 14, delay: 0.2 } } : {}),
        }}
        className="relative z-10 w-[90vw] max-w-lg"
      >
        {/* Rank label */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mb-6"
        >
          <p
            className="text-base uppercase tracking-[0.4em] mb-3"
            style={{ fontFamily: 'var(--font-heading)', color: colors.accent, fontSize: '1.1rem' }}
          >
            {rankLabels[contestant.rank]}
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[2px] w-16" style={{ background: `linear-gradient(90deg, transparent, ${colors.accent})` }} />
            <span className="text-3xl">{contestant.icon}</span>
            <div className="h-[2px] w-16" style={{ background: `linear-gradient(90deg, ${colors.accent}, transparent)` }} />
          </div>
        </motion.div>

        {/* Card */}
        <div className={cardBorderClass}>
          <div
            className="rounded-[14px] p-8 sm:p-10 text-center relative overflow-hidden"
            style={{
              background: contestant.rank === 1
                ? 'linear-gradient(180deg, rgba(25,18,8,0.98) 0%, rgba(12,10,5,0.98) 100%)'
                : 'linear-gradient(180deg, rgba(15,15,30,0.98) 0%, rgba(8,8,20,0.98) 100%)',
              boxShadow: `0 0 80px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${colors.glow.replace(/[\d.]+\)$/, '0.12)')} 0%, transparent 55%)`,
              }}
            />

            <div className="relative z-10">
              <div className="text-5xl sm:text-6xl mb-4">{contestant.icon}</div>
              <h2
                className={`font-bold mb-2 ${colors.textClass}`}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  letterSpacing: '0.03em',
                  color: colors.textClass ? undefined : 'var(--text-primary)',
                }}
              >
                {contestant.name}
              </h2>
              <p
                className="uppercase tracking-[0.2em] mb-1"
                style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: colors.accent, opacity: 0.8 }}
              >
                {contestant.position}
              </p>
              <p
                className="uppercase tracking-widest mb-6 opacity-40"
                style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem' }}
              >
                {contestant.team}
              </p>

              <div className="h-[2px] w-28 mx-auto mb-6" style={{ background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)` }} />

              <p
                className="text-2xl sm:text-3xl font-bold mb-5"
                style={{ fontFamily: 'var(--font-heading)', color: colors.accent, letterSpacing: '0.05em' }}
              >
                {contestant.score}
              </p>

              <p
                className="text-base sm:text-lg italic leading-relaxed opacity-70"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)', fontWeight: 300 }}
              >
                "{contestant.tagline}"
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
