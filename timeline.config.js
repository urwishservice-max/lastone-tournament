/**
 * SPARTAN: LAST LINE
 * Master Timeline & Camera Configuration
 * 
 * Precisely tuned so the Spartan model is ALWAYS FULLY VISIBLE in frame
 * across all scenes, with generous headroom and foot clearance.
 */

export const timelineConfig = {
  // Global settings
  global: {
    totalScrollHeightVh: 1400,
    cameraFov: 42,
    cameraNear: 0.1,
    cameraFar: 100,
    dprCap: 2,
    defaultEase: 'power2.inOut',
  },

  // Studio Lighting presets
  lightingPresets: {
    studioLight: {
      ambient: { color: 0xF4F4F2, intensity: 1.3 },
      key: { color: 0xFFFFFF, intensity: 2.8, pos: [4, 6, 5] },
      fill: { color: 0xE0E0DE, intensity: 1.1, pos: [-4, 2, 3] },
      rim: { color: 0xD7E6FF, intensity: 2.4, pos: [0, 5, -5] },
      accentRed: { color: 0xD7263D, intensity: 0, pos: [0, 1.5, 1.5] }
    },
    nightBattle: {
      ambient: { color: 0x141414, intensity: 0.4 },
      key: { color: 0x3A3A3A, intensity: 0.7, pos: [2, 4, 3] },
      fill: { color: 0x202020, intensity: 0.35, pos: [-3, 1, 2] },
      rim: { color: 0xFFFFFF, intensity: 3.8, pos: [0, 4, -4] },
      accentRed: { color: 0xD7263D, intensity: 4.5, pos: [0, 1.2, 1.5] }
    },
    goldSolstice: {
      ambient: { color: 0xFFF8E7, intensity: 1.5 },
      key: { color: 0xFFD700, intensity: 3.2, pos: [5, 5, 4] },
      fill: { color: 0xF5DEB3, intensity: 1.3, pos: [-4, 2, 2] },
      rim: { color: 0xFFFFFF, intensity: 2.6, pos: [0, 5, -4] },
      accentRed: { color: 0xD7263D, intensity: 0.6, pos: [1, 1.5, 2] }
    }
  },

  // 13 Scenes Configuration
  scenes: [
    // ACT I: THE AWAKENING
    {
      id: 'scene01',
      act: 'I',
      actTitle: 'AWAKENING',
      chapter: '01 / 13',
      name: 'SILENCE',
      durationVh: 80,
      camera: { pos: [0, 0, 5.5], target: [0, 0, 0] },
      spartan: { pos: [0, -10, 0], rot: [0, 0, 0], scale: 1.0, opacity: 0 },
      rifle: { visible: false },
      machinegun: { visible: false },
      map: { visible: false },
      particles: { ash: false, phalanx: false },
      theme: 'light',
    },
    {
      id: 'scene02',
      act: 'I',
      actTitle: 'AWAKENING',
      chapter: '02 / 13',
      name: 'AWAKENING',
      durationVh: 120,
      // Wide hero shot showing Spartan 100% full body, dollying smoothly into upper torso
      cameraStart: { pos: [0, -0.05, 5.0], target: [0, -0.05, 0] },
      cameraEnd: { pos: [0, 0.38, 2.5], target: [0, 0.48, 0] },
      spartan: { pos: [0, 0, 0], rotStart: [0, -Math.PI, 0], rotEnd: [0, Math.PI * 0.15, 0], scale: 0.82, opacity: 1 },
      rifle: { visible: false },
      machinegun: { visible: false },
      map: { visible: false },
      particles: { ash: false, phalanx: false },
      theme: 'light',
    },
    {
      id: 'scene03',
      act: 'I',
      actTitle: 'AWAKENING',
      chapter: '03 / 13',
      name: 'THE AEGIS',
      durationVh: 160,
      // Dramatic macro closeup of Spartan head & gold photonic visor, then cinematic animatic pull-out reveal
      cameraStart: { pos: [-0.14, 0.53, 1.18], target: [-0.20, 0.52, 0.08] },
      cameraEnd: { pos: [-0.25, -0.05, 4.6], target: [-0.25, -0.05, 0] },
      spartan: { pos: [-0.22, 0, 0], rot: [0, -0.38, 0], scale: 0.80, opacity: 1 },
      rifle: { visible: false },
      machinegun: { visible: false },
      map: { visible: false },
      particles: { ash: false, phalanx: false },
      theme: 'light',
    },
    {
      id: 'scene04',
      act: 'I',
      actTitle: 'AWAKENING',
      chapter: '04 / 13',
      name: 'THE BODY',
      durationVh: 100,
      // Spartan shifted to left, 100% FULLY VISIBLE from helmet to boots with plenty of margins!
      camera: { pos: [-0.25, -0.05, 4.8], target: [-0.25, -0.05, 0] },
      spartan: { pos: [-1.25, 0, 0], rot: [0, 0.32, 0], scale: 0.80, opacity: 1 },
      rifle: { visible: false },
      machinegun: { visible: false },
      map: { visible: false },
      particles: { ash: false, phalanx: false },
      theme: 'light',
    },

    // ACT II: THE LEGACY
    {
      id: 'scene05',
      act: 'II',
      actTitle: 'LEGACY',
      chapter: '05 / 13',
      name: 'THE HOT GATES',
      durationVh: 120,
      // Spartan silhouette center, 100% full body visible
      camera: { pos: [0, -0.05, 4.8], target: [0, -0.05, 0] },
      spartan: { pos: [0, 0, -0.4], rot: [0, 0, 0], scale: 0.82, silhouette: true, opacity: 1 },
      rifle: { visible: false },
      machinegun: { visible: false },
      map: { visible: false },
      particles: { ash: false, phalanx: true },
      theme: 'light',
    },
    {
      id: 'scene06',
      act: 'II',
      actTitle: 'LEGACY',
      chapter: '06 / 13',
      name: 'THE ORACLE OF THE MAP',
      durationVh: 140,
      // Clean tilted tactical 3D map plane (zero bubbles, zero tubes)
      cameraStart: { pos: [0, 3.8, 3.4], target: [0, 0, 0] },
      cameraEnd: { pos: [0.2, 3.2, 2.8], target: [0, 0, 0.1] },
      spartan: { pos: [0, -10, 0], opacity: 0 },
      rifle: { visible: false },
      machinegun: { visible: false },
      map: { visible: true, tilt: -1.1 },
      particles: { ash: true, phalanx: false },
      theme: 'light',
    },

    // ACT III: THE ARSENAL
    {
      id: 'scene07',
      act: 'III',
      actTitle: 'ARSENAL',
      chapter: '07 / 13',
      name: 'THE RIFLE',
      durationVh: 140,
      // Assault rifle centered and fully visible
      camera: { pos: [0, 0, 3.2], target: [0, 0, 0] },
      spartan: { pos: [-8, 0, 0], opacity: 0 },
      rifle: { visible: true, pos: [0.2, 0, 0], rot: [0.25, 0.6, 0.35], scale: 1.0 },
      machinegun: { visible: false },
      map: { visible: false },
      particles: { ash: false, phalanx: false },
      theme: 'light',
    },
    {
      id: 'scene08',
      act: 'III',
      actTitle: 'ARSENAL',
      chapter: '08 / 13',
      name: 'THE HEAVY',
      durationVh: 140,
      // Machine gun hero shot, fully visible
      camera: { pos: [0, 0, 3.2], target: [0, 0, 0] },
      spartan: { pos: [-8, 0, 0], opacity: 0 },
      rifle: { visible: false },
      machinegun: { visible: true, pos: [0.1, 0, 0], rot: [-0.15, -0.4, 0.1], scale: 1.0 },
      map: { visible: false },
      particles: { ash: false, phalanx: false },
      theme: 'light',
    },

    // ACT IV: THE LAST LINE
    {
      id: 'scene09',
      act: 'IV',
      actTitle: 'LAST LINE',
      chapter: '09 / 13',
      name: 'NIGHTFALL',
      durationVh: 120,
      // Full lineup silhouette in charcoal theme, Spartan fully visible
      camera: { pos: [0, -0.05, 5.0], target: [0, -0.05, 0] },
      spartan: { pos: [0, 0, 0], rot: [0, 0, 0], scale: 0.82, opacity: 1 },
      rifle: { visible: true, pos: [-1.4, 0.2, -0.2], rot: [0, 0.35, 0.2], scale: 0.75 },
      machinegun: { visible: true, pos: [1.4, 0.15, -0.2], rot: [0, -0.35, -0.1], scale: 0.75 },
      map: { visible: false },
      particles: { ash: true, phalanx: false },
      theme: 'charcoal',
    },
    {
      id: 'scene10',
      act: 'IV',
      actTitle: 'LAST LINE',
      chapter: '10 / 13',
      name: 'THE LAST STAND',
      durationVh: 140,
      // Camera circles Spartan at safe distance, Spartan 100% full body visible
      cameraStart: { pos: [2.8, -0.05, 3.8], target: [0, -0.05, 0] },
      cameraEnd: { pos: [-2.8, -0.05, 3.8], target: [0, -0.05, 0] },
      spartan: { pos: [0, 0, 0], rot: [0, 0.2, 0], scale: 0.82, opacity: 1 },
      rifle: { visible: true, pos: [-0.95, 0.5, 0.2], rot: [0.2, 0.5, 0], scale: 0.6 },
      machinegun: { visible: true, pos: [0.95, 0.45, 0.2], rot: [-0.2, -0.5, 0], scale: 0.6 },
      map: { visible: false },
      particles: { ash: true, phalanx: false },
      theme: 'charcoal',
    },
    {
      id: 'scene11',
      act: 'IV',
      actTitle: 'LAST LINE',
      chapter: '11 / 13',
      name: 'DAWN',
      durationVh: 100,
      // Lone Spartan warrior center-frame, 100% full body visible
      camera: { pos: [0, -0.05, 4.8], target: [0, -0.05, 0] },
      spartan: { pos: [0, 0, 0], rot: [0, 0, 0], scale: 0.82, opacity: 1 },
      rifle: { visible: false },
      machinegun: { visible: false },
      map: { visible: false },
      particles: { ash: false, phalanx: false },
      theme: 'light',
    },
    {
      id: 'scene12',
      act: 'IV',
      actTitle: 'LAST LINE',
      chapter: '12 / 13',
      name: 'THE ARMORY',
      durationVh: 140,
      // Free inspect 3D sandbox mode, model centered and fully visible
      camera: { pos: [0, -0.05, 4.4], target: [0, -0.05, 0] },
      spartan: { pos: [0, 0, 0], rot: [0, 0, 0], scale: 0.82, opacity: 1 },
      rifle: { visible: false },
      machinegun: { visible: false },
      map: { visible: false },
      particles: { ash: false, phalanx: false },
      theme: 'light',
      isSandbox: true,
    },
    {
      id: 'scene13',
      act: 'IV',
      actTitle: 'LAST LINE',
      chapter: '13 / 13',
      name: 'START GAME',
      durationVh: 100,
      // Finale: Spartan center hero pose, fully visible above START button
      camera: { pos: [0, 0.0, 4.6], target: [0, 0.0, 0] },
      spartan: { pos: [0, 0.1, 0], rot: [0, 0, 0], scale: 0.82, opacity: 1 },
      rifle: { visible: true, pos: [-1.2, 0.5, 0], rot: [0.1, 0.4, 0.2], scale: 0.7 },
      machinegun: { visible: true, pos: [1.2, 0.45, 0], rot: [-0.1, -0.4, -0.1], scale: 0.7 },
      map: { visible: false },
      particles: { ash: false, phalanx: false },
      theme: 'light',
      isFinale: true,
    }
  ]
};

export default timelineConfig;
