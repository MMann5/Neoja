import { motion } from 'motion/react';
import { useAudio } from '../hooks/useAudio';
import { useVoice } from '../hooks/useVoice';
import { useEffect, useRef } from 'react';

export default function SuspenseScreen() {
  const { playAnnouncerSequence } = useAudio();
  const { speakChampion } = useVoice();
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (hasPlayed.current) return;
    hasPlayed.current = true;

    playAnnouncerSequence();
    speakChampion();

    return () => {
      hasPlayed.current = false;
    };
  }, [playAnnouncerSequence, speakChampion]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center court-gradient z-50"
    >
      <div className="court-lines" />

      {/* Pulsing orange glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,0,0.2) 0%, transparent 55%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 text-center">
        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-8 h-[2px] w-40"
          style={{ background: 'linear-gradient(90deg, transparent, var(--neoja-orange), transparent)' }}
        />

        {/* "And the champion is..." text */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.6 }}
          className="uppercase tracking-[0.5em] mb-10"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
            color: 'var(--text-primary)',
          }}
        >
          And the champion is...
        </motion.p>

        {/* Big question mark — main focal point */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, type: 'spring', stiffness: 150 }}
          className="orange-shimmer-text mb-10"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(8rem, 20vw, 14rem)',
            lineHeight: 0.9,
          }}
        >
          ?
        </motion.div>

        {/* Animated dots */}
        <div className="flex items-center justify-center gap-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{ background: 'var(--neoja-orange)' }}
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Bottom line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mt-10 h-[2px] w-40"
          style={{ background: 'linear-gradient(90deg, transparent, var(--neoja-orange), transparent)' }}
        />
      </div>
    </motion.div>
  );
}
