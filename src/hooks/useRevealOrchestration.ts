import { useState, useCallback, useRef } from 'react';

export type RevealStep = 'idle' | 'countdown' | 'reveal3' | 'reveal2' | 'suspense' | 'reveal1' | 'podium';

interface RevealOrchestration {
  step: RevealStep;
  start: () => void;
}

const STEP_DURATIONS: Record<RevealStep, number> = {
  idle: 0,
  countdown: 6500,
  reveal3: 2500,
  reveal2: 3000,
  suspense: 3500,
  reveal1: 4000,
  podium: 0,
};

export function useRevealOrchestration(): RevealOrchestration {
  const [step, setStep] = useState<RevealStep>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const start = useCallback(() => {
    setStep('countdown');
    timerRef.current = setTimeout(() => {
      setStep('reveal3');
      timerRef.current = setTimeout(() => {
        setStep('reveal2');
        timerRef.current = setTimeout(() => {
          setStep('suspense');
          timerRef.current = setTimeout(() => {
            setStep('reveal1');
            timerRef.current = setTimeout(() => {
              setStep('podium');
            }, STEP_DURATIONS.reveal1);
          }, STEP_DURATIONS.suspense);
        }, STEP_DURATIONS.reveal2);
      }, STEP_DURATIONS.reveal3);
    }, STEP_DURATIONS.countdown);
  }, []);

  return { step, start };
}
