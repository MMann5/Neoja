import { useRef, useCallback } from 'react';

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  // Generate crowd noise using filtered white noise
  const playCrowdRoar = useCallback((duration: number, volume = 0.15, rampUp = 0.3) => {
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);

    // Fill with noise
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Bandpass filter to make it sound like crowd voices
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 800;
    bandpass.Q.value = 0.5;

    // Second filter for warmth
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 2500;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + rampUp);
    gain.gain.setValueAtTime(volume, ctx.currentTime + duration - 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    source.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + duration);
  }, [getCtx]);

  // Whistle sound
  const playWhistle = useCallback(() => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2800, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(3200, ctx.currentTime + 0.15);
    osc.frequency.setValueAtTime(3200, ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(2800, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }, [getCtx]);

  // Buzzer sound (like end of quarter)
  const playBuzzer = useCallback(() => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 220;
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  }, [getCtx]);

  // Drum hit
  const playDrumHit = useCallback(() => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);

    // Add noise snap
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.15;
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start();
  }, [getCtx]);

  const playRevealSting = useCallback((rank: 1 | 2 | 3) => {
    if (rank === 3) {
      // Drum hit + small crowd murmur
      playDrumHit();
      playCrowdRoar(2.5, 0.06, 0.3);
    } else if (rank === 2) {
      // Buzzer + bigger crowd
      playDrumHit();
      setTimeout(() => playBuzzer(), 100);
      playCrowdRoar(3.0, 0.1, 0.2);
    } else {
      // CHAMPION: Whistle + massive crowd roar + drums
      playWhistle();
      setTimeout(() => playDrumHit(), 200);
      setTimeout(() => playDrumHit(), 400);
      setTimeout(() => playDrumHit(), 600);
      setTimeout(() => playWhistle(), 800);
      // Big crowd explosion
      playCrowdRoar(5.0, 0.2, 0.15);
      // Second wave
      setTimeout(() => playCrowdRoar(3.0, 0.12, 0.5), 1500);
    }
  }, [playDrumHit, playBuzzer, playWhistle, playCrowdRoar]);

  const playCountdownTick = useCallback(() => {
    playDrumHit();
  }, [playDrumHit]);

  const playCountdownFinal = useCallback(() => {
    playBuzzer();
    playCrowdRoar(1.5, 0.08, 0.1);
  }, [playBuzzer, playCrowdRoar]);

  return { playRevealSting, playCountdownTick, playCountdownFinal };
}
