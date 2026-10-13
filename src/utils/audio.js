/**
 * SPARTAN: LAST LINE
 * Web Audio Ambient Synthesizer
 * 
 * Features:
 * - Sub-bass drone (55Hz / 110Hz detuned)
 * - Filtered pink noise wind layer
 * - Dynamic heartbeat generator for Scene 10 (Last Stand)
 * - Muzzle flash sound effect for Scene 08
 * - Tactical UI clicks for buttons and switches
 */

let audioCtx = null;
let isAudioActive = false;
let masterGain = null;
let droneGain = null;
let windGain = null;
let heartbeatInterval = null;

// Initialize on user interaction
export function initAudio() {
  if (audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);

  // --- Sub-Bass Drone Layer ---
  droneGain = audioCtx.createGain();
  droneGain.gain.setValueAtTime(0.18, audioCtx.currentTime);
  droneGain.connect(masterGain);

  const osc1 = audioCtx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(55, audioCtx.currentTime); // A1

  const filter1 = audioCtx.createBiquadFilter();
  filter1.type = 'lowpass';
  filter1.frequency.setValueAtTime(140, audioCtx.currentTime);

  osc1.connect(filter1);
  filter1.connect(droneGain);
  osc1.start();

  const osc2 = audioCtx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(110.4, audioCtx.currentTime); // Detuned A2

  const filter2 = audioCtx.createBiquadFilter();
  filter2.type = 'bandpass';
  filter2.frequency.setValueAtTime(220, audioCtx.currentTime);
  filter2.Q.setValueAtTime(3.0, audioCtx.currentTime);

  osc2.connect(filter2);
  filter2.connect(droneGain);
  osc2.start();

  // --- Wind / Filtered Pink Noise Layer ---
  const bufferSize = audioCtx.sampleRate * 2;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
    b6 = white * 0.115926;
  }

  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const windFilter = audioCtx.createBiquadFilter();
  windFilter.type = 'bandpass';
  windFilter.frequency.setValueAtTime(380, audioCtx.currentTime);
  windFilter.Q.setValueAtTime(2.0, audioCtx.currentTime);

  windGain = audioCtx.createGain();
  windGain.gain.setValueAtTime(0.06, audioCtx.currentTime);

  whiteNoise.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(masterGain);
  whiteNoise.start();
}

export function toggleAudio() {
  initAudio();
  if (!audioCtx) return false;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  isAudioActive = !isAudioActive;
  const now = audioCtx.currentTime;

  if (isAudioActive) {
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0.65, now + 1.2);
  } else {
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
  }

  return isAudioActive;
}

export function getAudioState() {
  return isAudioActive;
}

export function playTacticalClick() {
  if (!audioCtx || !isAudioActive) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1400, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

export function playMuzzleFlash() {
  if (!audioCtx || !isAudioActive) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(160, now);
  osc.frequency.exponentialRampToValueAtTime(30, now + 0.18);

  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.22);
}

export function startHeartbeat() {
  if (!audioCtx || heartbeatInterval) return;
  heartbeatInterval = setInterval(() => {
    if (!isAudioActive || !audioCtx) return;
    const now = audioCtx.currentTime;

    // First lub
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.frequency.setValueAtTime(75, now);
    osc1.frequency.exponentialRampToValueAtTime(45, now + 0.08);
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.1);

    // Second dub (after 140ms)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.frequency.setValueAtTime(85, now + 0.14);
    osc2.frequency.exponentialRampToValueAtTime(50, now + 0.22);
    gain2.gain.setValueAtTime(0.28, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.14);
    osc2.stop(now + 0.25);
  }, 1000);
}

export function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}
