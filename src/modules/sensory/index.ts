import { useSettingsStore } from "@/stores/settings.store";

// Web Audio API Context
let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// Simple Synthesizer
const playTone = (
  freq: number,
  type: OscillatorType,
  duration: number,
  startTime = 0
) => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

  gain.gain.setValueAtTime(0.1, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + startTime + duration
  );

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
};

export const sensory = {
  play: (effect: "complete" | "add" | "warning") => {
    const settings = useSettingsStore();
    if (!settings.soundEnabled) return;

    switch (effect) {
      case "complete":
        // High pitched "Ding!"
        playTone(880, "sine", 0.1); // A5
        playTone(1760, "sine", 0.3, 0.1); // A6
        break;
      case "add":
        // Mechanical click
        playTone(300, "square", 0.05);
        break;
      case "warning":
        // Low pulsing alert
        playTone(150, "sawtooth", 0.3);
        playTone(140, "sawtooth", 0.3, 0.2);
        break;
    }
  },

  vibrate: (pattern: "light" | "medium" | "heavy" | "pulse") => {
    const settings = useSettingsStore();
    if (!settings.hapticsEnabled) return;

    if (!navigator.vibrate) return;

    switch (pattern) {
      case "light":
        navigator.vibrate(10); // 10ms
        break;
      case "medium":
        navigator.vibrate(20);
        break;
      case "heavy":
        navigator.vibrate(50);
        break;
      case "pulse":
        navigator.vibrate([30, 50, 30, 50]);
        break;
    }
  },
};
