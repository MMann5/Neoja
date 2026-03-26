import { AnimatePresence } from 'motion/react';
import { contestants } from '../data/contestants';
import type { RevealStep } from '../hooks/useRevealOrchestration';
import PlacementReveal from './PlacementReveal';
import FinalPodium from './FinalPodium';
import Countdown from './Countdown';
import SuspenseScreen from './SuspenseScreen';
import ParticleCanvas from './ParticleCanvas';

interface Props {
  step: RevealStep;
}

const getContestant = (rank: 1 | 2 | 3) => contestants.find((c) => c.rank === rank)!;

export default function RevealSequence({ step }: Props) {
  return (
    <>
      {step !== 'idle' && step !== 'podium' && step !== 'countdown' && step !== 'suspense' && (
        <ParticleCanvas
          intensity={step === 'reveal1' ? 'high' : 'medium'}
          goldMode={step === 'reveal1'}
        />
      )}

      <AnimatePresence mode="wait">
        {step === 'countdown' && (
          <Countdown key="countdown" onComplete={() => {}} />
        )}

        {step === 'reveal3' && (
          <PlacementReveal key="reveal3" contestant={getContestant(3)} />
        )}

        {step === 'reveal2' && (
          <PlacementReveal key="reveal2" contestant={getContestant(2)} />
        )}

        {step === 'suspense' && (
          <SuspenseScreen key="suspense" />
        )}

        {step === 'reveal1' && (
          <PlacementReveal key="reveal1" contestant={getContestant(1)} />
        )}

        {step === 'podium' && <FinalPodium key="podium" />}
      </AnimatePresence>
    </>
  );
}
