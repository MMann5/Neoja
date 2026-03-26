import { motion } from 'motion/react';
import type { Contestant } from '../data/contestants';

interface Props {
  contestant: Contestant;
  index: number;
}

const rankStyles: Record<number, {
  height: string;
  maxW: string;
  borderClass: string;
  glowColor: string;
  accentColor: string;
  textClass: string;
  scale: number;
}> = {
  1: {
    height: '',
    maxW: 'max-w-[370px]',
    borderClass: 'card-border-gold',
    glowColor: 'rgba(255,215,0,0.25)',
    accentColor: 'var(--gold-crown)',
    textClass: 'gold-shimmer-text',
    scale: 1,
  },
  2: {
    height: '',
    maxW: 'max-w-[280px]',
    borderClass: 'card-border-silver',
    glowColor: 'rgba(192,216,240,0.15)',
    accentColor: 'var(--silver-gleam)',
    textClass: '',
    scale: 0.93,
  },
  3: {
    height: '',
    maxW: 'max-w-[260px]',
    borderClass: 'card-border-bronze',
    glowColor: 'rgba(205,127,50,0.15)',
    accentColor: 'var(--bronze-warm)',
    textClass: '',
    scale: 0.88,
  },
};

export default function PodiumCard({ contestant, index }: Props) {
  const style = rankStyles[contestant.rank];

  return (
    <motion.div
      initial={{ y: contestant.rank === 1 ? -250 : 180, opacity: 0, scale: 0.6 }}
      animate={{ y: 0, opacity: 1, scale: style.scale }}
      transition={{
        delay: contestant.rank === 1 ? 0.3 : 0.1 + index * 0.2,
        duration: 1.0,
        type: 'spring',
        stiffness: 80,
        damping: 14,
      }}
      className={`${style.maxW} w-full shrink-0`}
      style={{
        animation: 'card-idle-breathe 4s ease-in-out infinite',
        animationDelay: `${index * 0.5}s`,
      }}
    >
      {/* Rank badge above card */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 + index * 0.15, type: 'spring', stiffness: 200 }}
        className="text-center mb-3"
      >
        <span
          className={`text-5xl font-black ${style.textClass}`}
          style={{
            fontFamily: 'var(--font-display)',
            color: style.textClass ? undefined : style.accentColor,
          }}
        >
          {contestant.rank === 1 ? '🏆' : `#${contestant.rank}`}
        </span>
      </motion.div>

      <motion.div
        className={style.borderClass}
        animate={contestant.rank === 1 ? {
          boxShadow: [
            '0 0 20px rgba(255,215,0,0.3)',
            '0 0 50px rgba(255,215,0,0.6)',
            '0 0 20px rgba(255,215,0,0.3)',
          ],
        } : undefined}
        transition={contestant.rank === 1 ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        <div
          className={`rounded-[14px] ${contestant.rank === 1 ? 'p-8' : 'p-6'} text-center relative overflow-hidden ${style.height}`}
          style={{
            background: contestant.rank === 1
              ? 'linear-gradient(180deg, rgba(25,18,8,0.98) 0%, rgba(12,10,5,0.98) 100%)'
              : 'linear-gradient(180deg, rgba(15,15,30,0.98) 0%, rgba(8,8,20,0.98) 100%)',
            boxShadow: `0 0 50px ${style.glowColor}, inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}
        >
          {/* Inner top glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${style.glowColor} 0%, transparent 50%)`,
            }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="text-4xl mb-3">{contestant.icon}</div>
            <h3
              className={`font-bold mb-1 ${style.textClass}`}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
                letterSpacing: '0.02em',
                color: style.textClass ? undefined : 'var(--text-primary)',
              }}
            >
              {contestant.name}
            </h3>
            <p
              className="uppercase tracking-[0.15em] mb-1 opacity-60"
              style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: style.accentColor }}
            >
              {contestant.position}
            </p>
            <p
              className="tracking-widest opacity-30 mb-4 uppercase"
              style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem' }}
            >
              {contestant.team}
            </p>

            <div className="h-[2px] w-16 mb-4" style={{ background: `linear-gradient(90deg, transparent, ${style.accentColor}, transparent)` }} />

            <p
              className="text-xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-heading)', color: style.accentColor, letterSpacing: '0.04em' }}
            >
              {contestant.score}
            </p>

            <p
              className="text-sm italic leading-relaxed opacity-55"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}
            >
              "{contestant.tagline}"
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
