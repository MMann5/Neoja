import { useRef, useCallback } from 'react';

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  // Crowd noise — bandpass-filtered white noise
  const playCrowdRoar = useCallback((duration: number, volume = 0.15, rampUp = 0.3) => {
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 900;
    bandpass.Q.value = 0.4;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 3000;

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

  // Voice-like formant — simulates a vowel sound ("aaah", "ooh")
  const playFormantVoice = useCallback((
    fundamental: number,
    formants: number[],
    duration: number,
    volume = 0.06,
    rampUp = 0.1
  ) => {
    const ctx = getCtx();

    // Fundamental buzz (voice source)
    const buzz = ctx.createOscillator();
    buzz.type = 'sawtooth';
    buzz.frequency.value = fundamental;

    // Create formant filters for each vowel resonance
    const gains: GainNode[] = [];
    formants.forEach((freq) => {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = freq;
      bp.Q.value = 8;

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + rampUp);
      g.gain.setValueAtTime(volume, ctx.currentTime + duration * 0.7);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      buzz.connect(bp);
      bp.connect(g);
      g.connect(ctx.destination);
      gains.push(g);
    });

    buzz.start();
    buzz.stop(ctx.currentTime + duration);
  }, [getCtx]);

  // "AAAND" — vowel A sound (formants ~730, 1090, 2440)
  const playAnnouncerAnd = useCallback(() => {
    playFormantVoice(120, [730, 1090, 2440], 1.2, 0.04, 0.15);
  }, [playFormantVoice]);

  // "THE" — short schwa (formants ~500, 1500, 2500)
  const playAnnouncerThe = useCallback(() => {
    playFormantVoice(130, [500, 1500, 2500], 0.3, 0.03, 0.05);
  }, [playFormantVoice]);

  // "WINNERRR" — vowel I → R (formants shift ~270→400, 2290→1200)
  const playAnnouncerWinner = useCallback(() => {
    const ctx = getCtx();
    const buzz = ctx.createOscillator();
    buzz.type = 'sawtooth';
    buzz.frequency.setValueAtTime(140, ctx.currentTime);
    buzz.frequency.linearRampToValueAtTime(110, ctx.currentTime + 1.5);

    // "I" → "ER" formant shift
    const f1 = ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(270, ctx.currentTime);
    f1.frequency.linearRampToValueAtTime(500, ctx.currentTime + 1.5);
    f1.Q.value = 8;

    const f2 = ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.setValueAtTime(2290, ctx.currentTime);
    f2.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 1.5);
    f2.Q.value = 6;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.05, ctx.currentTime + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

    buzz.connect(f1);
    buzz.connect(f2);
    f1.connect(gain);
    f2.connect(gain);
    gain.connect(ctx.destination);

    buzz.start();
    buzz.stop(ctx.currentTime + 1.8);
  }, [getCtx]);

  // "ISSS" — sibilant hiss
  const playAnnouncerIs = useCallback(() => {
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 4000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.04, ctx.currentTime + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    source.connect(hp);
    hp.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + 0.8);
  }, [getCtx]);

  // Whistle
  const playWhistle = useCallback(() => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2800, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(3200, ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(2800, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }, [getCtx]);

  // Buzzer
  const playBuzzer = useCallback(() => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 200;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.7);
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

    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.12;
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start();
  }, [getCtx]);

  // Reveal stings
  const playRevealSting = useCallback((rank: 1 | 2 | 3) => {
    if (rank === 3) {
      playDrumHit();
      playCrowdRoar(2.5, 0.06, 0.3);
    } else if (rank === 2) {
      playDrumHit();
      setTimeout(() => playBuzzer(), 100);
      playCrowdRoar(3.0, 0.1, 0.2);
    } else {
      // CHAMPION — full announcer voice + crowd explosion
      playWhistle();
      setTimeout(() => playDrumHit(), 150);
      setTimeout(() => playDrumHit(), 350);
      setTimeout(() => playDrumHit(), 550);
      setTimeout(() => playWhistle(), 700);

      // Crowd explosion — massive roar
      playCrowdRoar(5.0, 0.25, 0.1);
      setTimeout(() => playCrowdRoar(3.5, 0.15, 0.5), 1200);
    }
  }, [playDrumHit, playBuzzer, playWhistle, playCrowdRoar]);

  // Suspense — announcer "and the winner isss..."
  const playAnnouncerSequence = useCallback(() => {
    playAnnouncerAnd();                    // "AAAND"
    setTimeout(() => playAnnouncerThe(), 1000);  // "THE"
    setTimeout(() => playAnnouncerWinner(), 1200); // "WINNERRR"
    setTimeout(() => playAnnouncerIs(), 2500);    // "ISSS"
    // Low tension crowd murmur
    playCrowdRoar(3.5, 0.04, 0.5);
  }, [playAnnouncerAnd, playAnnouncerThe, playAnnouncerWinner, playAnnouncerIs, playCrowdRoar]);

  const playCountdownTick = useCallback(() => {
    playDrumHit();
  }, [playDrumHit]);

  const playCountdownFinal = useCallback(() => {
    playBuzzer();
    playCrowdRoar(1.5, 0.08, 0.1);
  }, [playBuzzer, playCrowdRoar]);

  return { playRevealSting, playCountdownTick, playCountdownFinal, playAnnouncerSequence };
}
