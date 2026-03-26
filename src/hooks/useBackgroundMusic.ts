import { useRef, useCallback } from 'react';
import * as Tone from 'tone';
import type { RevealStep } from './useRevealOrchestration';

export function useBackgroundMusic() {
  const isPlayingRef = useRef(false);
  const kickRef = useRef<Tone.MembraneSynth | null>(null);
  const snareRef = useRef<Tone.NoiseSynth | null>(null);
  const hihatRef = useRef<Tone.NoiseSynth | null>(null);
  const bassRef = useRef<Tone.Synth | null>(null);
  const padRef = useRef<Tone.PolySynth | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const compressorRef = useRef<Tone.Compressor | null>(null);
  const kickLoopRef = useRef<Tone.Loop | null>(null);
  const hatLoopRef = useRef<Tone.Loop | null>(null);
  const snareLoopRef = useRef<Tone.Loop | null>(null);
  const bassLoopRef = useRef<Tone.Pattern<string> | null>(null);

  const start = useCallback(async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    await Tone.start();

    // Master chain: compressor → reverb → destination
    compressorRef.current = new Tone.Compressor(-20, 4).toDestination();
    reverbRef.current = new Tone.Reverb({ decay: 3, wet: 0.2 }).connect(compressorRef.current);

    // Kick
    kickRef.current = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 5,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.1 },
    }).connect(compressorRef.current);
    kickRef.current.volume.value = -10;

    // Snare
    snareRef.current = new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: { attack: 0.001, decay: 0.13, sustain: 0, release: 0.03 },
    }).connect(reverbRef.current);
    snareRef.current.volume.value = -16;

    // Hi-hat
    hihatRef.current = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.01 },
    }).connect(compressorRef.current);
    hihatRef.current.volume.value = -22;

    // Bass synth
    bassRef.current = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.05, decay: 0.3, sustain: 0.6, release: 0.5 },
    }).connect(compressorRef.current);
    bassRef.current.volume.value = -14;

    // Pad synth
    padRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 2, decay: 1, sustain: 0.8, release: 3 },
    }).connect(reverbRef.current);
    padRef.current.volume.value = -24;

    // Start transport
    Tone.getTransport().bpm.value = 90;

    // Kick loop — every quarter note
    kickLoopRef.current = new Tone.Loop((time) => {
      kickRef.current?.triggerAttackRelease('C1', '8n', time);
    }, '2n'); // Every half note for light

    // Hi-hat loop — eighth notes
    hatLoopRef.current = new Tone.Loop((time) => {
      hihatRef.current?.triggerAttackRelease('32n', time);
    }, '8n');

    // Snare loop — on beats 2 and 4
    snareLoopRef.current = new Tone.Loop((time) => {
      snareRef.current?.triggerAttackRelease('16n', time);
    }, '2n');

    // Bass pattern — D minor
    bassLoopRef.current = new Tone.Pattern((time, note) => {
      bassRef.current?.triggerAttackRelease(note, '4n', time);
    }, ['D2', 'D2', 'F2', 'A2'], 'up');
    bassLoopRef.current.interval = '2n';

    // Start pad chord
    padRef.current.triggerAttack(['D3', 'F3', 'A3']);

    // Start loops
    kickLoopRef.current.start(0);
    hatLoopRef.current.start(0);
    bassLoopRef.current.start(0);

    Tone.getTransport().start();
  }, []);

  const setIntensity = useCallback((step: RevealStep) => {
    if (!isPlayingRef.current) return;

    const transport = Tone.getTransport();

    if (step === 'countdown') {
      // Already set from start — light
    } else if (step === 'reveal3') {
      transport.bpm.rampTo(100, 2);
      kickLoopRef.current?.set({ interval: '4n' }); // Kick every quarter
      if (kickRef.current) kickRef.current.volume.rampTo(-8, 1);
      snareLoopRef.current?.start(); // Add snare
    } else if (step === 'reveal2') {
      transport.bpm.rampTo(110, 1.5);
      if (kickRef.current) kickRef.current.volume.rampTo(-6, 0.5);
      if (snareRef.current) snareRef.current.volume.rampTo(-12, 0.5);
      if (hihatRef.current) hihatRef.current.volume.rampTo(-18, 0.5);
    } else if (step === 'suspense') {
      // DROP — kill drums, just bass + pad
      kickLoopRef.current?.stop();
      hatLoopRef.current?.stop();
      snareLoopRef.current?.stop();
      if (bassRef.current) bassRef.current.volume.rampTo(-10, 1);
      if (padRef.current) padRef.current.volume.rampTo(-18, 1);
    } else if (step === 'reveal1') {
      // FULL BLAST
      transport.bpm.rampTo(125, 0.5);
      kickLoopRef.current?.start();
      hatLoopRef.current?.start();
      snareLoopRef.current?.start();
      if (kickRef.current) kickRef.current.volume.rampTo(-4, 0.3);
      if (snareRef.current) snareRef.current.volume.rampTo(-8, 0.3);
      if (hihatRef.current) hihatRef.current.volume.rampTo(-14, 0.3);
      if (bassRef.current) bassRef.current.volume.rampTo(-8, 0.5);
      if (padRef.current) padRef.current.volume.rampTo(-16, 0.5);
    } else if (step === 'podium') {
      // Stop everything
      kickLoopRef.current?.stop();
      hatLoopRef.current?.stop();
      snareLoopRef.current?.stop();
      bassLoopRef.current?.stop();
      if (bassRef.current) bassRef.current.volume.rampTo(-Infinity, 0.5);
      if (padRef.current) padRef.current.volume.rampTo(-Infinity, 0.5);
      if (kickRef.current) kickRef.current.volume.rampTo(-Infinity, 0.3);
      if (hihatRef.current) hihatRef.current.volume.rampTo(-Infinity, 0.3);
      if (snareRef.current) snareRef.current.volume.rampTo(-Infinity, 0.3);
      setTimeout(() => {
        Tone.getTransport().stop();
        padRef.current?.releaseAll();
      }, 800);
    }
  }, []);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    Tone.getTransport().stop();
    kickLoopRef.current?.stop();
    hatLoopRef.current?.stop();
    snareLoopRef.current?.stop();
    bassLoopRef.current?.stop();
    padRef.current?.releaseAll();
  }, []);

  return { start, stop, setIntensity };
}
