import React from 'react';
import { useExperience } from '../context/ExperienceContext';

const SCENE_TITLES = [
  '01. Silence',
  '02. Awakening',
  '03. The Aegis',
  '04. The Body',
  '05. The Hot Gates',
  '06. The Oracle of the Map',
  '07. The Rifle',
  '08. The Heavy',
  '09. Nightfall',
  '10. The Last Stand',
  '11. Dawn',
  '12. The Armory',
  '13. Start Game'
];

export function VerticalProgress() {
  const { activeSceneIndex, scrollProgress, scrollToScene } = useExperience();

  return (
    <aside className="vertical-progress-track" aria-hidden="true">
      <div className="progress-line-container">
        <div
          className="progress-line-fill"
          id="progress-line-fill"
          style={{ height: `${(scrollProgress * 100).toFixed(1)}%` }}
        />
        <div className="progress-tick-group">
          {SCENE_TITLES.map((title, idx) => (
            <div
              key={idx}
              className={`progress-tick ${idx <= activeSceneIndex ? 'active' : ''}`}
              title={title}
              onClick={() => scrollToScene(idx)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

export function TacticalFooter() {
  const { activeSceneName } = useExperience();

  return (
    <footer className="hud-footer">
      <div className="hud-footer-left">
        <span className="scene-title-label" id="scene-title-display">
          {activeSceneName}
        </span>
        <span className="hud-coord-label">GRID 38°47'N // 22°32'E</span>
      </div>
      <div className="hud-footer-right">
        <div className="scroll-prompt-indicator">
          <span className="scroll-text">SCROLL TO DIRECT FILM</span>
          <div className="scroll-pulse-line" />
        </div>
      </div>
    </footer>
  );
}
