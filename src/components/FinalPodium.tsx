import { motion } from 'motion/react';
import { contestants, themeConfig } from '../data/contestants';
import PodiumCard from './PodiumCard';
import ParticleCanvas from './ParticleCanvas';
import CourtSVG from './CourtSVG';

const second = contestants.find((c) => c.rank === 2)!;
const first = contestants.find((c) => c.rank === 1)!;
const third = contestants.find((c) => c.rank === 3)!;

export default function FinalPodium() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="fixed inset-0 court-gradient flex flex-col items-center overflow-y-auto overflow-x-hidden"
    >
      <ParticleCanvas intensity="high" goldMode />
      <CourtSVG glow />

      {/* Top gold glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,215,0,0.07) 0%, transparent 55%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1.0 }}
        className="relative z-10 text-center mt-6 sm:mt-8 mb-4 sm:mb-6 px-4"
      >
        <p
          className="text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-2 opacity-50"
          style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)' }}
        >
          {themeConfig.subtitle}
        </p>
        <h1
          className="gold-shimmer-text font-black"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
          }}
        >
          Final Standings
        </h1>
        <div
          className="mx-auto mt-3 h-[2px] w-32 sm:w-48"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold-crown), transparent)' }}
        />
      </motion.div>

      {/* === MOBILE: vertical stack (1st → 2nd → 3rd) === */}
      <div className="relative z-10 flex flex-col items-center gap-4 px-4 w-full sm:hidden pb-8">
        <PodiumCard contestant={first} index={0} />
        <PodiumCard contestant={second} index={1} />
        <PodiumCard contestant={third} index={2} />
      </div>

      {/* === DESKTOP: horizontal podium with platforms === */}
      <div className="relative z-10 hidden sm:flex items-end justify-center gap-0 px-4 w-full max-w-5xl flex-1">
        {/* 2nd place — left */}
        <div className="flex flex-col items-center">
          <PodiumCard contestant={second} index={0} />
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 60, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8, type: 'spring', stiffness: 100 }}
            className="w-full max-w-[280px] rounded-t-lg relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(192,216,240,0.15) 0%, rgba(192,216,240,0.05) 100%)',
              borderTop: '2px solid rgba(192,216,240,0.3)',
              borderLeft: '1px solid rgba(192,216,240,0.1)',
              borderRight: '1px solid rgba(192,216,240,0.1)',
            }}
          >
            <div className="flex items-center justify-center h-full">
              <span className="text-4xl font-black opacity-30" style={{ fontFamily: 'var(--font-display)', color: 'var(--silver-gleam)' }}>2</span>
            </div>
          </motion.div>
        </div>

        {/* 1st place — center */}
        <div className="flex flex-col items-center">
          <PodiumCard contestant={first} index={1} />
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 100, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.0, type: 'spring', stiffness: 80 }}
            className="w-full max-w-[370px] rounded-t-lg relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(255,215,0,0.15) 0%, rgba(255,107,0,0.05) 100%)',
              borderTop: '2px solid rgba(255,215,0,0.4)',
              borderLeft: '1px solid rgba(255,215,0,0.15)',
              borderRight: '1px solid rgba(255,215,0,0.15)',
              boxShadow: '0 -10px 40px rgba(255,215,0,0.1)',
            }}
          >
            <div className="flex items-center justify-center h-full">
              <span className="text-5xl font-black gold-shimmer-text" style={{ fontFamily: 'var(--font-display)' }}>1</span>
            </div>
          </motion.div>
        </div>

        {/* 3rd place — right */}
        <div className="flex flex-col items-center">
          <PodiumCard contestant={third} index={2} />
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 35, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6, type: 'spring', stiffness: 120 }}
            className="w-full max-w-[260px] rounded-t-lg relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(205,127,50,0.15) 0%, rgba(205,127,50,0.05) 100%)',
              borderTop: '2px solid rgba(205,127,50,0.3)',
              borderLeft: '1px solid rgba(205,127,50,0.1)',
              borderRight: '1px solid rgba(205,127,50,0.1)',
            }}
          >
            <div className="flex items-center justify-center h-full">
              <span className="text-3xl font-black opacity-30" style={{ fontFamily: 'var(--font-display)', color: 'var(--bronze-warm)' }}>3</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="relative z-10 w-full py-4 text-center shrink-0"
      >
        <p
          className="text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-35"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-muted)', fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)' }}
        >
          {themeConfig.tagline}
        </p>
      </motion.div>
    </motion.div>
  );
}
