import { AnimatePresence } from 'motion/react';
import { useRevealOrchestration } from './hooks/useRevealOrchestration';
import AtmosphereScreen from './components/AtmosphereScreen';
import RevealSequence from './components/RevealSequence';

export default function App() {
  const { step, start } = useRevealOrchestration();

  return (
    <div className="w-full h-full relative">
      <div className="noise-overlay" />
      <div className="scanlines" />

      <AnimatePresence mode="wait">
        {step === 'idle' && <AtmosphereScreen key="atmosphere" onStart={start} />}
      </AnimatePresence>

      {step !== 'idle' && <RevealSequence step={step} />}
    </div>
  );
}
