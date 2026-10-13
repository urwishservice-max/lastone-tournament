/**
 * SPARTAN: LAST LINE
 * Scene Manager & DOM Interactions
 * Handles text reveals, counters, callouts, and DOM-driven scene events
 */

import gsap from 'gsap';
import { startHeartbeat, stopHeartbeat, playTacticalClick } from '../utils/audio.js';

export class SceneManager {
  constructor() {
    this.activeSceneIndex = 0;
    this.activeAct = 'I';
    this.listeners = new Map();
    this.countersTriggered = false;
    this.standTimerStarted = false;
    this.standTimerInterval = null;

    this.initDOM();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
  }

  initDOM() {
    // Act Navigation Indicators
    this.actNavItems = document.querySelectorAll('.act-nav-item');
    this.progressTicks = document.querySelectorAll('.progress-tick');
    this.chapterEl = document.getElementById('chapter-counter');
    this.sceneTitleEl = document.getElementById('scene-title-display');

    // Scene 04 Counter Elements
    this.statCohesion = document.getElementById('stat-cohesion');
    this.statResistance = document.getElementById('stat-resistance');
    this.statVelocity = document.getElementById('stat-velocity');
    this.statHardness = document.getElementById('stat-hardness');

    // Scene 10 Stand Counter
    this.standCounterEl = document.getElementById('stand-time-counter');

    // Scene 12 Sandbox Controls
    this.initSandboxControls();

    // Scene 13 Finale Magnetic Button
    this.initFinaleButton();
  }

  setActiveScene(sceneConfig, index, totalScenes = 13) {
    this.activeSceneIndex = index;
    this.activeAct = sceneConfig.act;

    // 1. Update HUD Top Left & Bottom Left
    if (this.chapterEl) {
      this.chapterEl.textContent = `CHAPTER ${sceneConfig.chapter}`;
    }
    if (this.sceneTitleEl) {
      this.sceneTitleEl.textContent = sceneConfig.name;
    }

    // 2. Update Act Navigation
    this.actNavItems.forEach(item => {
      const act = item.getAttribute('data-act');
      if (act === sceneConfig.act) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // 3. Update Vertical Progress Ticks
    this.progressTicks.forEach((tick, i) => {
      if (i <= index) {
        tick.classList.add('active');
      } else {
        tick.classList.remove('active');
      }
    });

    // 4. Trigger Scene 04 Counters
    if (sceneConfig.id === 'scene04' && !this.countersTriggered) {
      this.countersTriggered = true;
      this.animateStats();
    }

    // 5. Trigger Scene 10 Heartbeat and Timer
    if (sceneConfig.id === 'scene10') {
      startHeartbeat();
      this.startStandTimer();
      document.body.classList.add('heartbeat-active');
    } else {
      stopHeartbeat();
      this.stopStandTimer();
      document.body.classList.remove('heartbeat-active');
    }

    // 6. Theme Switching (Light #EDEDEA vs Charcoal #121212)
    if (sceneConfig.theme === 'charcoal') {
      document.body.classList.add('theme-charcoal');
      document.body.classList.remove('theme-light');
    } else {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-charcoal');
    }

    // 7. Dawn Flash (Scene 11)
    if (sceneConfig.id === 'scene11') {
      const flash = document.getElementById('dawn-flash');
      if (flash) {
        flash.classList.add('trigger-flash');
        setTimeout(() => flash.classList.remove('trigger-flash'), 900);
      }
    }
  }

  animateStats() {
    const targets = { cohesion: 0, resistance: 0, velocity: 0, hardness: 0 };
    gsap.to(targets, {
      cohesion: 99.8,
      resistance: 14200,
      velocity: 36,
      hardness: 65,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        if (this.statCohesion) this.statCohesion.textContent = `${targets.cohesion.toFixed(1)}%`;
        if (this.statResistance) this.statResistance.textContent = `${Math.floor(targets.resistance).toLocaleString()} N`;
        if (this.statVelocity) this.statVelocity.textContent = `${Math.floor(targets.velocity)} m/s`;
        if (this.statHardness) this.statHardness.textContent = `${Math.floor(targets.hardness)} HRC`;
      }
    });
  }

  startStandTimer() {
    if (this.standTimerStarted) return;
    this.standTimerStarted = true;
    let seconds = 0;
    this.standTimerInterval = setInterval(() => {
      seconds += 7;
      if (seconds > 360) seconds = 360;
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      if (this.standCounterEl) {
        this.standCounterEl.textContent = `HOLD THE LINE: ${mins}:${secs} / 06:00`;
      }
      if (seconds >= 360) clearInterval(this.standTimerInterval);
    }, 120);
  }

  stopStandTimer() {
    this.standTimerStarted = false;
    if (this.standTimerInterval) {
      clearInterval(this.standTimerInterval);
      this.standTimerInterval = null;
    }
  }

  initSandboxControls() {
    // Model switch buttons
    const modelBtns = document.querySelectorAll('.sandbox-model-btn');
    modelBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modelBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playTacticalClick();
        const model = btn.getAttribute('data-model');
        this.emit('sandboxModelChange', model);
      });
    });

    // Lighting preset buttons
    const lightBtns = document.querySelectorAll('.sandbox-light-btn');
    lightBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        lightBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playTacticalClick();
        const light = btn.getAttribute('data-light');
        this.emit('sandboxLightChange', light);
      });
    });

    // Camera preset buttons
    const presetBtns = document.querySelectorAll('.sandbox-preset-btn');
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playTacticalClick();
        const preset = btn.getAttribute('data-preset');
        this.emit('sandboxPresetChange', preset);
      });
    });
  }

  initFinaleButton() {
    const startBtn = document.getElementById('start-game-btn');
    if (!startBtn) return;

    // Magnetic cursor hover effect
    startBtn.addEventListener('mousemove', (e) => {
      const rect = startBtn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      gsap.to(startBtn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    startBtn.addEventListener('mouseleave', () => {
      gsap.to(startBtn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)'
      });
    });

    startBtn.addEventListener('click', () => {
      playTacticalClick();
      this.emit('startGameClicked');
    });
  }
}
