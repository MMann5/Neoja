import { useRef, useCallback } from 'react';
import * as Tone from 'tone';

export function useAudio() {
  const startedRef = useRef(false);
  const kickRef = useRef<Tone.MembraneSynth | null>(null);
  const snareRef = useRef<Tone.NoiseSynth | null>(null);
  const hihatRef = useRef<Tone.NoiseSynth | null>(null);
  const metalRef = useRef<Tone.MetalSynth | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);

  const ensureStarted = useCallback(async () => {
    if (!startedRef.current) {
      await Tone.start();
      startedRef.current = true;
    }

    // Lazy init instruments
    if (!reverbRef.current) {
      reverbRef.current = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).toDestination();
    }

    if (!kickRef.current) {
      kickRef.current = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 6,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
      }).connect(reverbRef.current);
    }

    if (!snareRef.current) {
      snareRef.current = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 },
      }).connect(reverbRef.current);
      snareRef.current.volume.value = -8;
    }

    if (!hihatRef.current) {
      hihatRef.current = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.01 },
      }).toDestination();
      hihatRef.current.volume.value = -18;
    }

    if (!metalRef.current) {
      metalRef.current = new Tone.MetalSynth({
        envelope: { attack: 0.001, decay: 0.8, release: 0.2 },
        harmonicity: 5.1,
        modulationIndex: 16,
        resonance: 4000,
        octaves: 1.5,
      }).connect(reverbRef.current);
      metalRef.current.volume.value = -15;
    }
  }, []);

  const playKick = useCallback(async () => {
    await ensureStarted();
    kickRef.current?.triggerAttackRelease('C1', '8n');
  }, [ensureStarted]);

  const playSnare = useCallback(async () => {
    await ensureStarted();
    snareRef.current?.triggerAttackRelease('8n');
  }, [ensureStarted]);

  const playHihat = useCallback(async () => {
    await ensureStarted();
    hihatRef.current?.triggerAttackRelease('32n');
  }, [ensureStarted]);

  const playCymbal = useCallback(async () => {
    await ensureStarted();
    metalRef.current?.triggerAttackRelease('C4', '4n');
  }, [ensureStarted]);

  // Impact hit — big kick + cymbal crash
  const playImpact = useCallback(async () => {
    await ensureStarted();
    kickRef.current?.triggerAttackRelease('C1', '4n');
    metalRef.current?.triggerAttackRelease('C4', '2n');
  }, [ensureStarted]);

  // Crowd roar via filtered noise
  const playCrowdRoar = useCallback(async (duration = 3, volume = -12) => {
    await ensureStarted();
    const noise = new Tone.Noise('brown').start();
    const filter = new Tone.Filter(800, 'bandpass').toDestination();
    const gain = new Tone.Gain(0.001).connect(filter);
    noise.connect(gain);

    // Ramp up
    gain.gain.rampTo(Tone.dbToGain(volume), 0.3);
    // Sustain then ramp down
    setTimeout(() => {
      gain.gain.rampTo(0.001, 1);
      setTimeout(() => { noise.stop(); noise.dispose(); gain.dispose(); filter.dispose(); }, 1200);
    }, (duration - 1) * 1000);
  }, [ensureStarted]);

  // Drum roll build-up
  const playDrumRoll = useCallback(async (duration = 2) => {
    await ensureStarted();
    const steps = Math.floor(duration * 12);
    for (let i = 0; i < steps; i++) {
      const delay = (i / steps) * duration * 1000;
      // Accelerating — gaps get smaller
      const accel = (i * i) / (steps * steps) * duration * 1000;
      setTimeout(() => {
        snareRef.current?.triggerAttackRelease('32n');
      }, accel < delay ? accel : delay);
    }
  }, [ensureStarted]);

  // Reveal stings
  const playRevealSting = useCallback(async (rank: 1 | 2 | 3) => {
    await ensureStarted();
    if (rank === 3) {
      playKick();
      setTimeout(() => playHihat(), 150);
      playCrowdRoar(2.5, -20);
    } else if (rank === 2) {
      playImpact();
      setTimeout(() => playSnare(), 200);
      playCrowdRoar(3, -16);
    } else {
      // CHAMPION — full blast
      playCymbal();
      setTimeout(() => playKick(), 100);
      setTimeout(() => playKick(), 300);
      setTimeout(() => playSnare(), 500);
      setTimeout(() => playCymbal(), 700);
      setTimeout(() => playKick(), 900);
      // Massive crowd
      playCrowdRoar(5, -8);
      setTimeout(() => playCrowdRoar(3, -12), 1500);
    }
  }, [ensureStarted, playKick, playSnare, playHihat, playCymbal, playImpact, playCrowdRoar]);

  // Suspense — drum roll + tension
  const playAnnouncerSequence = useCallback(async () => {
    await ensureStarted();
    playDrumRoll(3);
    playCrowdRoar(3.5, -22);
  }, [ensureStarted, playDrumRoll, playCrowdRoar]);

  const playCountdownTick = useCallback(async () => {
    await ensureStarted();
    playKick();
  }, [ensureStarted, playKick]);

  const playCountdownFinal = useCallback(async () => {
    await ensureStarted();
    playImpact();
    playCrowdRoar(1.5, -18);
  }, [ensureStarted, playImpact, playCrowdRoar]);

  return { playRevealSting, playCountdownTick, playCountdownFinal, playAnnouncerSequence, ensureStarted };
}
