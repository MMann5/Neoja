import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAudio } from '../hooks/useAudio';
import { useVoice } from '../hooks/useVoice';
import CourtSVG from './CourtSVG';

interface Props {
  onComplete: () => void;
}

export default function Countdown({ onComplete }: Props) {
  const [count, setCount] = useState(3);
  const { playCountdownTick, playCountdownFinal } = useAudio();
  const { speakCountdown } = useVoice();

  useEffect(() => {
    playCountdownTick();
    speakCountdown(3);
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          playCountdownFinal();
          speakCountdown(0);
          setTimeout(onComplete, 600);
          return 0;
        }
        playCountdownTick();
        speakCountdown(prev - 1);
        return prev - 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [onComplete, playCountdownTick, playCountdownFinal, speakCountdown]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center court-gradient z-50"
    >
      <CourtSVG />

      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={count}
            initial={{ scale: 0.3, opacity: 0, filter: 'blur(20px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ scale: 2.5, opacity: 0, filter: 'blur(12px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="orange-shimmer-text"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(10rem, 25vw, 18rem)',
              lineHeight: 1,
            }}
          >
            {count}
          </motion.div>
        ) : (
          <motion.div
            key="go"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 150, damping: 15 }}
            className="uppercase tracking-[0.3em] font-bold orange-shimmer-text"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(4rem, 10vw, 8rem)',
            }}
          >
            Game Time
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
