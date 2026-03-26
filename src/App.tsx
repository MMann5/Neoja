import { useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { useRevealOrchestration } from './hooks/useRevealOrchestration';
import { useBackgroundMusic } from './hooks/useBackgroundMusic';
import { useVoice } from './hooks/useVoice';
import AtmosphereScreen from './components/AtmosphereScreen';
import RevealSequence from './components/RevealSequence';

export default function App() {
  const { step, start } = useRevealOrchestration();
  const music = useBackgroundMusic();
  const { preload } = useVoice();
  const prevStep = useRef(step);

  const handleStart = useCallback(() => {
    preload();
    music.start();
    start();
  }, [music, start, preload]);

  useEffect(() => {
    if (step !== prevStep.current) {
      prevStep.current = step;
      music.setIntensity(step);
    }
  }, [step, music]);

  return (
    <div className="w-full h-full relative">
      <div className="noise-overlay" />
      <div className="scanlines" />

      <AnimatePresence mode="wait">
        {step === 'idle' && <AtmosphereScreen key="atmosphere" onStart={handleStart} />}
      </AnimatePresence>

      {step !== 'idle' && <RevealSequence step={step} />}
    </div>
  );
}
