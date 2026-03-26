import { motion } from 'motion/react';
import { themeConfig } from '../data/contestants';
import ParticleCanvas from './ParticleCanvas';

interface Props {
  onStart: () => void;
}

const titleVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9, filter: 'blur(20px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, delay: 0.6, ease: 'easeOut' },
  },
};

const locationVariants = {
  hidden: { opacity: 0, letterSpacing: '0.6em' },
  visible: {
    opacity: 0.8,
    letterSpacing: '0.35em',
    transition: { duration: 1.8, delay: 1.0, ease: 'easeOut' },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, delay: 1.8, type: 'spring', stiffness: 120 },
  },
};

const lineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 0.5,
    transition: { duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AtmosphereScreen({ onStart }: Props) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center court-gradient"
      exit={{ opacity: 0, scale: 1.15, filter: 'blur(12px)' }}
      transition={{ duration: 0.8 }}
    >
      <ParticleCanvas intensity="low" />

      {/* Court lines decoration */}
      <div className="court-lines" />

      {/* Orange glow from below */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,107,0,0.12) 0%, transparent 65%)',
          filter: 'blur(60px)',
          animation: 'pulse-glow 3s ease-in-out infinite',
        }}
      />

      {/* Purple glow from top */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(107,47,160,0.15) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 text-center px-6">
        {/* Basketball icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.0, delay: 0.2, type: 'spring', stiffness: 100 }}
          className="text-6xl mb-6"
        >
          🏀
        </motion.div>

        <motion.div variants={locationVariants} initial="hidden" animate="visible">
          <p
            className="text-xs uppercase tracking-widest mb-6"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.3em' }}
          >
            {themeConfig.location}
          </p>
        </motion.div>

        <motion.div variants={lineVariants} initial="hidden" animate="visible">
          <div
            className="mx-auto mb-6 h-[2px] w-56"
            style={{ background: 'linear-gradient(90deg, transparent, var(--neoja-orange), transparent)' }}
          />
        </motion.div>

        <motion.h1
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="orange-shimmer-text leading-none mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 10vw, 9rem)',
            letterSpacing: '0.04em',
          }}
        >
          {themeConfig.title}
        </motion.h1>

        <motion.p
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
          className="text-lg sm:text-xl md:text-2xl font-light tracking-wide mb-2"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)', fontWeight: 300 }}
        >
          {themeConfig.subtitle}
        </motion.p>

        <motion.p
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
          className="text-sm tracking-widest uppercase mb-12 opacity-50"
          style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', letterSpacing: '0.3em' }}
        >
          {themeConfig.year}
        </motion.p>

        <motion.div variants={lineVariants} initial="hidden" animate="visible">
          <div
            className="mx-auto mb-10 h-[2px] w-32"
            style={{ background: 'linear-gradient(90deg, transparent, var(--neoja-orange), transparent)' }}
          />
        </motion.div>

        <motion.button
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover={{
            scale: 1.08,
            boxShadow: '0 8px 60px rgba(255,107,0,0.5), 0 0 120px rgba(255,107,0,0.2)',
          }}
          whileTap={{ scale: 0.94 }}
          onClick={onStart}
          className="relative px-20 py-6 rounded-full uppercase tracking-[0.35em] font-bold border-2 transition-all duration-300 overflow-hidden"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.3rem',
            color: '#fff',
            borderColor: 'rgba(255,140,42,0.6)',
            background: 'linear-gradient(135deg, var(--neoja-orange) 0%, #e05500 50%, var(--neoja-orange-bright) 100%)',
            boxShadow: '0 6px 30px rgba(255,107,0,0.4), 0 0 60px rgba(255,107,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
            padding: '10px 20px',
            minWidth: '200px',
            cursor: 'pointer',
          }}
        >
          <span className="relative z-10">Start</span>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent 50%, rgba(255,255,255,0.05))',
            }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2.5, duration: 1.5 }}
          className="mt-8 text-xs tracking-[0.2em] uppercase"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontWeight: 300 }}
        >
          {themeConfig.tagline}
        </motion.p>
      </div>
    </motion.div>
  );
}
