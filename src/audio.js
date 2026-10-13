/**
 * Atmospheric Web Audio Synthesizer for Spartan Experience
 * Generates an ancient cinematic drone with low rumble, filtered noise (wind), and harmonic resonance.
 */

let audioCtx = null;
let isPlaying = false;
let masterGain = null;
let noiseNode = null;
let droneOsc1 = null;
let droneOsc2 = null;

export function initAudio() {
  if (audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);

  // 1. Low Drone (fundamental frequency: 55Hz - A1)
  droneOsc1 = audioCtx.createOscillator();
  droneOsc1.type = 'sawtooth';
  droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);

  const filter1 = audioCtx.createBiquadFilter();
  filter1.type = 'lowpass';
  filter1.frequency.setValueAtTime(140, audioCtx.currentTime);

  const gain1 = audioCtx.createGain();
  gain1.gain.setValueAtTime(0.18, audioCtx.currentTime);

  droneOsc1.connect(filter1);
  filter1.connect(gain1);
  gain1.connect(masterGain);

  // 2. Sub Harmonic (110Hz - A2 slightly detuned)
  droneOsc2 = audioCtx.createOscillator();
  droneOsc2.type = 'triangle';
  droneOsc2.frequency.setValueAtTime(110.5, audioCtx.currentTime);

  const filter2 = audioCtx.createBiquadFilter();
  filter2.type = 'bandpass';
  filter2.frequency.setValueAtTime(220, audioCtx.currentTime);
  filter2.Q.setValueAtTime(3, audioCtx.currentTime);

  const gain2 = audioCtx.createGain();
  gain2.gain.setValueAtTime(0.08, audioCtx.currentTime);

  droneOsc2.connect(filter2);
  filter2.connect(gain2);
  gain2.connect(masterGain);

  // 3. Pink Noise Wind Layer
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

  noiseNode = audioCtx.createBufferSource();
  noiseNode.buffer = noiseBuffer;
  noiseNode.loop = true;

  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.setValueAtTime(320, audioCtx.currentTime);

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.12, audioCtx.currentTime);

  noiseNode.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);

  droneOsc1.start();
  droneOsc2.start();
  noiseNode.start();
}

export function toggleAudio() {
  if (!audioCtx) initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (isPlaying) {
    masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.4);
    isPlaying = false;
  } else {
    masterGain.gain.setTargetAtTime(0.35, audioCtx.currentTime, 0.6);
    isPlaying = true;
  }

  return isPlaying;
}

export function playWeaponClash() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);

  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
}
