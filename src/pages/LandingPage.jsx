import React from 'react';
import { useExperience } from '../context/ExperienceContext';
import Preloader from '../components/Preloader';
import CustomCursor from '../components/CustomCursor';
import { Letterbox, FilmGrain, DawnFlash } from '../components/Overlays';
import MacroViewfinder from '../components/MacroViewfinder';
import TacticalHUD from '../components/TacticalHUD';
import { VerticalProgress, TacticalFooter } from '../components/NavigationWidgets';
import ThreeViewport from '../components/ThreeViewport';
import {
  Scene01Silence,
  Scene02Awakening,
  Scene03Aegis,
  Scene04Body
} from '../components/scenes/ScenesAct1';
import {
  Scene05HotGates,
  Scene06OracleMap
} from '../components/scenes/ScenesAct2';
import {
  Scene07Rifle,
  Scene08Heavy
} from '../components/scenes/ScenesAct3';
import {
  Scene09Nightfall,
  Scene10LastStand,
  Scene11Dawn,
  Scene12ArmorySandbox,
  Scene13Finale
} from '../components/scenes/ScenesAct4';

export default function LandingPage() {
  const { isDawnFlash } = useExperience();

  return (
    <>
      {/* Loading Overlay */}
      <Preloader />

      {/* Interactive Cursor */}
      <CustomCursor />

      {/* 2.39:1 Cinema Letterbox Bars */}
      <Letterbox />

      {/* Cinematic Film Grain & Vignette */}
      <FilmGrain />

      {/* Dawn / Start Flash */}
      <DawnFlash isFlashing={isDawnFlash} />

      {/* Optical Macro Viewfinder Telemetry Overlay */}
      <MacroViewfinder />

      {/* Master 3D WebGL Canvas */}
      <ThreeViewport />

      {/* Tactical HUD Header */}
      <TacticalHUD />

      {/* Vertical 13-Scene Navigation Track */}
      <VerticalProgress />

      {/* Fixed Telemetry Footer */}
      <TacticalFooter />

      {/* 4 Acts, 13 Scenes Scrollytelling Film Container */}
      <main id="film-scroll-container" className="film-scroll-container">
        {/* ACT I: THE AWAKENING */}
        <Scene01Silence />
        <Scene02Awakening />
        <Scene03Aegis />
        <Scene04Body />

        {/* ACT II: THE LEGACY */}
        <Scene05HotGates />
        <Scene06OracleMap />

        {/* ACT III: THE ARSENAL */}
        <Scene07Rifle />
        <Scene08Heavy />

        {/* ACT IV: THE LAST LINE */}
        <Scene09Nightfall />
        <Scene10LastStand />
        <Scene11Dawn />
        <Scene12ArmorySandbox />
        <Scene13Finale />
      </main>
    </>
  );
}
