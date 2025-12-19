/**
 * @module sensory
 * @description Audio and haptic feedback module for BMad
 */

import { useSettingsStore } from "@/stores/settings.store";

/** Web Audio API Context singleton */
let audioCtx: AudioContext | null = null;

/**
 * Get or create the Web Audio context
 * @returns {AudioContext | null} The audio context instance
 */
const getAudioContext = (): AudioContext | null => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
  }
  return audioCtx;
};

/**
 * Play a synthesized tone
 * @param {number} freq - Frequency in Hz
 * @param {OscillatorType} type - Wave type (sine, square, sawtooth, triangle)
 * @param {number} duration - Duration in seconds
 * @param {number} startTime - Start delay in seconds
 */
const playTone = (
  freq: number,
  type: OscillatorType,
  duration: number,
  startTime = 0
): void => {
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

/** Sound effect types */
type SoundEffect = "complete" | "add" | "warning";

/** Vibration patterns */
type VibrationPattern = "light" | "medium" | "heavy" | "pulse";

/**
 * Sensory feedback utilities for audio and haptics
 */
export const sensory = {
  /**
   * Play a sound effect
   * @param {SoundEffect} effect - The effect to play
   */
  play: (effect: SoundEffect): void => {
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

  /**
   * Trigger haptic feedback
   * @param {VibrationPattern} pattern - The vibration pattern
   */
  vibrate: (pattern: VibrationPattern): void => {
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
