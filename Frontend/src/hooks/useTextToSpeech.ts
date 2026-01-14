import { useState, useEffect, useCallback, useRef } from 'react';
export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const synth = useRef<SpeechSynthesis | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synth.current = window.speechSynthesis;
      const updateVoices = () => {
        const availableVoices = synth.current?.getVoices() || [];
        setVoices(availableVoices);
        // Default to first English voice
        const defaultVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
        setSelectedVoice(defaultVoice);
      };
      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }, []);
  const speak = useCallback((text: string) => {
    if (!synth.current) return;

    // Cancel any current speaking
    synth.current.cancel();
    const newUtterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) newUtterance.voice = selectedVoice;
    newUtterance.rate = rate;
    newUtterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    newUtterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    newUtterance.onerror = event => {
      console.error('Speech synthesis error', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.current = newUtterance;
    synth.current.speak(newUtterance);
  }, [selectedVoice, rate]);
  const pause = useCallback(() => {
    if (synth.current && isSpeaking && !isPaused) {
      synth.current.pause();
      setIsPaused(true);
    }
  }, [isSpeaking, isPaused]);
  const resume = useCallback(() => {
    if (synth.current && isPaused) {
      synth.current.resume();
      setIsPaused(false);
    }
  }, [isPaused]);
  const stop = useCallback(() => {
    if (synth.current) {
      synth.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);
  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate
  };
}