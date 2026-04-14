// Web Audio API sound engine — no external files needed
let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext => {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
};

const playTone = (
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15,
  ramp?: { to: number; time: number }
) => {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (ramp) osc.frequency.linearRampToValueAtTime(ramp.to, ctx.currentTime + ramp.time);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // silent fail
  }
};

const playNoise = (duration: number, volume = 0.05) => {
  try {
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  } catch {
    // silent
  }
};

export const sounds = {
  /** Soft click for buttons */
  click: () => playTone(800, 0.08, "sine", 0.1),

  /** Navigation next */
  next: () => {
    playTone(523, 0.1, "sine", 0.12);
    setTimeout(() => playTone(659, 0.1, "sine", 0.12), 60);
  },

  /** Navigation back */
  back: () => {
    playTone(659, 0.1, "sine", 0.1);
    setTimeout(() => playTone(523, 0.1, "sine", 0.1), 60);
  },

  /** Dialog/popup open */
  popup: () => {
    playTone(440, 0.15, "sine", 0.1);
    setTimeout(() => playTone(554, 0.12, "sine", 0.1), 80);
    setTimeout(() => playTone(659, 0.15, "sine", 0.12), 160);
  },

  /** Item dropped into zone */
  drop: () => playTone(600, 0.12, "triangle", 0.12),

  /** Item picked up / drag start */
  pickup: () => playTone(400, 0.06, "sine", 0.08),

  /** Item removed from zone */
  remove: () => playTone(300, 0.1, "sawtooth", 0.06),

  /** Tab switch */
  tab: () => playTone(700, 0.06, "sine", 0.08),

  /** Reset action */
  reset: () => {
    playTone(500, 0.1, "triangle", 0.08);
    setTimeout(() => playTone(400, 0.1, "triangle", 0.08), 80);
    setTimeout(() => playTone(300, 0.12, "triangle", 0.08), 160);
  },

  /** Score reveal */
  reveal: () => {
    [523, 587, 659, 784].forEach((f, i) =>
      setTimeout(() => playTone(f, 0.2, "sine", 0.1), i * 120)
    );
  },

  /** Success fanfare (score >= 80%) */
  success: () => {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) =>
      setTimeout(() => playTone(f, 0.3, "sine", 0.12), i * 150)
    );
    setTimeout(() => playNoise(0.15, 0.04), 600); // sparkle
  },

  /** Fail sound (score < 50%) */
  fail: () => {
    playTone(400, 0.3, "sawtooth", 0.08);
    setTimeout(() => playTone(350, 0.3, "sawtooth", 0.08), 200);
    setTimeout(() => playTone(300, 0.5, "sawtooth", 0.06), 400);
  },

  /** Medium result (50-79%) */
  okay: () => {
    playTone(523, 0.2, "sine", 0.1);
    setTimeout(() => playTone(440, 0.25, "sine", 0.1), 200);
  },

  /** Scene transition whoosh */
  whoosh: () => playTone(200, 0.2, "sine", 0.06, { to: 800, time: 0.15 }),

  /** Start button */
  start: () => {
    [392, 523, 659, 784].forEach((f, i) =>
      setTimeout(() => playTone(f, 0.25, "sine", 0.12), i * 100)
    );
  },

  /** Step forward in animation */
  step: () => playTone(660, 0.08, "sine", 0.08),
};
