import React, { useEffect } from 'react';
import { useExperience } from '../context/ExperienceContext';

export default function MacroViewfinder() {
  const { isMacroActive, macroArea, macroTelemetry, enterMacro, exitMacro } = useExperience();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMacroActive) {
        exitMacro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMacroActive, exitMacro]);

  return (
    <aside
      id="macro-viewfinder"
      className={`macro-viewfinder ${isMacroActive ? 'active' : ''}`}
      aria-label="Macro Viewfinder Telemetry"
      aria-hidden={!isMacroActive}
    >
      <div className="viewfinder-frame">
        <div className="viewfinder-corner top-left" />
        <div className="viewfinder-corner top-right" />
        <div className="viewfinder-corner bottom-left" />
        <div className="viewfinder-corner bottom-right" />
        <div className="viewfinder-reticle">
          <span className="reticle-line h" />
          <span className="reticle-line v" />
          <span className="reticle-box" />
        </div>
      </div>

      {/* Viewfinder Telemetry Bar */}
      <div className="viewfinder-hud-panel">
        <div className="viewfinder-top-bar">
          <div className="viewfinder-rec-status">
            <span className="viewfinder-pulse-indicator" />
            <span className="viewfinder-title">OPTICAL MACRO TELEMETRY</span>
          </div>
          <div className="viewfinder-target-name" id="viewfinder-target-name">
            {macroTelemetry.name}
          </div>
        </div>

        <div className="viewfinder-center-controls">
          <div className="viewfinder-area-nav" role="toolbar" aria-label="Target Armor Area">
            <button
              className={`area-chip ${macroArea === 'visor' ? 'active' : ''}`}
              onClick={() => enterMacro('visor')}
              title="Focus Helmet & Visor"
            >
              <span className="chip-dot" /> VISOR [4.8X]
            </button>
            <button
              className={`area-chip ${macroArea === 'chest' ? 'active' : ''}`}
              onClick={() => enterMacro('chest')}
              title="Focus Chest Carapace"
            >
              <span className="chip-dot" /> CHEST [4.2X]
            </button>
            <button
              className={`area-chip ${macroArea === 'side' ? 'active' : ''}`}
              onClick={() => enterMacro('side')}
              title="Focus Side Armor"
            >
              <span className="chip-dot" /> SIDE [3.9X]
            </button>
          </div>

          <button
            id="viewfinder-zoomout-btn"
            className="viewfinder-zoomout-btn"
            onClick={exitMacro}
            title="Exit Extreme Close-Up and Zoom Out (ESC)"
          >
            <span className="zoomout-icon">⤢</span>
            <span className="zoomout-text">ZOOM OUT / NORMAL VIEW</span>
            <span className="zoomout-key">ESC</span>
          </button>
        </div>

        <div className="viewfinder-bottom-telemetry">
          <div className="telemetry-pill">
            MAGNIFICATION: <strong id="viewfinder-mag">{macroTelemetry.mag}</strong>
          </div>
          <div className="telemetry-pill">
            FOCAL DEPTH: <strong id="viewfinder-focal">{macroTelemetry.focal}</strong>
          </div>
          <div className="telemetry-pill">
            SENSOR: <strong>SPECTRAL GOLD EM-IR</strong>
          </div>
          <div className="telemetry-pill status-lock">
            LOCK: <strong>TRACKING</strong>
          </div>
        </div>
      </div>
    </aside>
  );
}
