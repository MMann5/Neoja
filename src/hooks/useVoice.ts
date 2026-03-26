import { useRef, useCallback } from 'react';

export function useVoice() {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const getVoice = useCallback(() => {
    // Always reuse the same voice once picked
    if (voiceRef.current) return voiceRef.current;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    // Pick the first available English voice and lock it
    const preferred = [
      'Google US English',
      'Google UK English Male',
      'Microsoft Mark',
      'Microsoft David',
      'Alex',
      'Daniel',
    ];

    for (const name of preferred) {
      const found = voices.find((v) => v.name.includes(name));
      if (found) {
        voiceRef.current = found;
        return found;
      }
    }

    const english = voices.find((v) => v.lang.startsWith('en'));
    voiceRef.current = english ?? voices[0];
    return voiceRef.current;
  }, []);

  const speak = useCallback((text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
  }) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getVoice();
    if (voice) utterance.voice = voice;

    utterance.rate = options?.rate ?? 1.1;
    utterance.pitch = options?.pitch ?? 1.2;
    utterance.volume = options?.volume ?? 1;

    window.speechSynthesis.speak(utterance);
  }, [getVoice]);

  const preload = useCallback(() => {
    window.speechSynthesis.getVoices();
    // Lock the voice immediately
    getVoice();
    const warmup = new SpeechSynthesisUtterance('');
    warmup.volume = 0;
    const v = voiceRef.current;
    if (v) warmup.voice = v;
    window.speechSynthesis.speak(warmup);
  }, [getVoice]);

  const speakCountdown = useCallback((number: number) => {
    const words: Record<number, string> = {
      3: 'THREE!',
      2: 'TWO!',
      1: 'ONE!',
      0: 'GAME TIME!',
    };
    const text = words[number] ?? '';
    if (!text) return;

    speak(text, {
      rate: number === 0 ? 1.0 : 1.15,
      pitch: number === 0 ? 1.4 : 1.2,
      volume: 1,
    });
  }, [speak]);

  const speakChampion = useCallback(() => {
    speak('AND THE WINNER IS!', {
      rate: 0.95,
      pitch: 1.3,
      volume: 1,
    });
  }, [speak]);

  const speakReveal = useCallback((rank: 1 | 2 | 3, name: string) => {
    // Clean name for speech — remove quotes and nicknames
    const cleanName = name.replace(/["]/g, '').replace(/\s+/g, ' ');

    if (rank === 1) {
      speak(`YOUR CHAMPION! ${cleanName}!`, {
        rate: 1.05,
        pitch: 1.4,
        volume: 1,
      });
    } else if (rank === 2) {
      speak(`In second place, ${cleanName}!`, {
        rate: 1.1,
        pitch: 1.2,
        volume: 1,
      });
    } else {
      speak(`Third place, ${cleanName}!`, {
        rate: 1.15,
        pitch: 1.1,
        volume: 1,
      });
    }
  }, [speak]);

  return { preload, speakCountdown, speakChampion, speakReveal };
}
