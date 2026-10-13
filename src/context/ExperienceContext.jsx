import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { timelineConfig } from '../timeline.config.js';
import { toggleAudio, getAudioState, playTacticalClick, playMuzzleFlash, startHeartbeat, stopHeartbeat } from '../utils/audio.js';

const ExperienceContext = createContext(null);

export function ExperienceProvider({ children }) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [activeAct, setActiveAct] = useState('I');
  const [activeChapter, setActiveChapter] = useState('01 / 13');
  const [activeSceneName, setActiveSceneName] = useState('SILENCE');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [preloadProgress, setPreloadProgress] = useState(15);
  const [isPreloadDone, setIsPreloadDone] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Macro Mode
  const [isMacroActive, setIsMacroActive] = useState(false);
  const [macroArea, setMacroArea] = useState('visor');
  const [macroTelemetry, setMacroTelemetry] = useState({
    name: 'HELMET & VISOR // OPTICAL SUBSYSTEM',
    mag: '4.8X',
    focal: '1.12 m'
  });

  // Sandbox State (Scene 12)
  const [sandboxModel, setSandboxModel] = useState('spartan');
  const [sandboxLight, setSandboxLight] = useState('studioLight');
  const [sandboxPreset, setSandboxPreset] = useState('HERO');

  // Dawn Flash
  const [isDawnFlash, setIsDawnFlash] = useState(false);

  // Stats (Scene 04)
  const [stats, setStats] = useState({
    cohesion: '99.8%',
    resistance: '14,200 N',
    velocity: '36 m/s',
    hardness: '65 HRC'
  });

  // Stand Counter (Scene 10)
  const [standTime, setStandTime] = useState('00:00 / 06:00');
  const [isHeartbeatActive, setIsHeartbeatActive] = useState(false);

  // References for imperative bridge with Three / Lenis
  const lenisInstanceRef = useRef(null);
  const threeBridgeRef = useRef(null);

  // Handle Audio Toggle
  const toggleSound = useCallback(() => {
    const active = toggleAudio();
    setIsAudioActive(active);
  }, []);

  // Macro controls
  const enterMacro = useCallback((area = 'visor') => {
    playTacticalClick();
    setMacroArea(area);
    setIsMacroActive(true);
    if (threeBridgeRef.current?.enterCloseUp) {
      threeBridgeRef.current.enterCloseUp(area);
    }
  }, []);

  const exitMacro = useCallback(() => {
    playTacticalClick();
    setIsMacroActive(false);
    if (threeBridgeRef.current?.exitCloseUp) {
      threeBridgeRef.current.exitCloseUp();
    }
  }, []);

  // Sandbox controls
  const updateSandboxModel = useCallback((model) => {
    playTacticalClick();
    setSandboxModel(model);
    if (threeBridgeRef.current?.setSandboxModel) {
      threeBridgeRef.current.setSandboxModel(model);
    }
  }, []);

  const updateSandboxLight = useCallback((light) => {
    playTacticalClick();
    setSandboxLight(light);
    if (threeBridgeRef.current?.setSandboxLight) {
      threeBridgeRef.current.setSandboxLight(light);
    }
  }, []);

  const updateSandboxPreset = useCallback((preset) => {
    playTacticalClick();
    setSandboxPreset(preset);
    if (threeBridgeRef.current?.setSandboxPreset) {
      threeBridgeRef.current.setSandboxPreset(preset);
    }
  }, []);

  // Scroll To Scene
  const scrollToScene = useCallback((index) => {
    playTacticalClick();
    const sceneEls = document.querySelectorAll('.film-scene');
    const target = sceneEls[index];
    if (target && lenisInstanceRef.current) {
      lenisInstanceRef.current.scrollTo(target, { duration: 1.6 });
    }
  }, []);

  // Scroll To Act
  const scrollToAct = useCallback((actNumber, sceneIndex) => {
    scrollToScene(sceneIndex);
  }, [scrollToScene]);

  // Start Game Trigger
  const triggerStartGame = useCallback(() => {
    playTacticalClick();
    if (threeBridgeRef.current?.triggerStartGame) {
      threeBridgeRef.current.triggerStartGame();
    }
  }, []);

  return (
    <ExperienceContext.Provider
      value={{
        activeSceneIndex,
        setActiveSceneIndex,
        activeAct,
        setActiveAct,
        activeChapter,
        setActiveChapter,
        activeSceneName,
        setActiveSceneName,
        scrollProgress,
        setScrollProgress,
        preloadProgress,
        setPreloadProgress,
        isPreloadDone,
        setIsPreloadDone,
        isAudioActive,
        toggleSound,
        isMacroActive,
        macroArea,
        macroTelemetry,
        setMacroTelemetry,
        enterMacro,
        exitMacro,
        sandboxModel,
        updateSandboxModel,
        sandboxLight,
        updateSandboxLight,
        sandboxPreset,
        updateSandboxPreset,
        isDawnFlash,
        setIsDawnFlash,
        stats,
        setStats,
        standTime,
        setStandTime,
        isHeartbeatActive,
        setIsHeartbeatActive,
        lenisInstanceRef,
        threeBridgeRef,
        scrollToScene,
        scrollToAct,
        triggerStartGame
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }
  return context;
}
