import React, { useRef } from 'react';
import gsap from 'gsap';
import { useExperience } from '../../context/ExperienceContext';

export function Scene09Nightfall() {
  return (
    <section className="film-scene" id="scene09" data-scene-index="8" data-act="IV">
      <div className="giant-bg-word" aria-hidden="true">NIGHTFALL</div>
      <div className="scene-inner scene-layout-center">
        <div className="caption-tracked">AMBIENT SHIFT: 00:00 HOURS</div>
        <h2 className="display-title-large">THEY COME AT NIGHT.</h2>
        <div className="red-accent-bar center" />
        <p className="scene-body-text centered">
          The horizon blackens. The sky fills with falling cinder and ash. The perimeter is breached on three flanks.
          There is no relief column inbound.
        </p>
      </div>
    </section>
  );
}

export function Scene10LastStand() {
  const { standTime } = useExperience();

  return (
    <section className="film-scene" id="scene10" data-scene-index="9" data-act="IV">
      <div className="giant-bg-word" aria-hidden="true">STAND</div>
      <div className="scene-inner scene-layout-bottom">
        <div className="last-stand-banner">
          <div className="stand-timer-display" id="stand-time-counter">
            HOLD THE LINE: {standTime}
          </div>
          <div className="stand-sub-status">HOSTILE CONTACT PERIMETER: 40 METERS AND CLOSING</div>
          <div className="heartbeat-pulse-icon">
            <span className="heart-pulse-dot" />
            <span>VITALS: ADRENALINE SURGE DETECTED</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Scene11Dawn() {
  return (
    <section className="film-scene" id="scene11" data-scene-index="10" data-act="IV">
      <div className="giant-bg-word" aria-hidden="true">0</div>
      <div className="scene-inner scene-layout-center">
        <div className="caption-tracked">FIRST LIGHT // 06:01 HOURS</div>
        <h2 className="display-title-stagger">
          <span className="title-line">0 STEPS.</span>
          <span className="title-line accent-text">RETREAT RECORD.</span>
        </h2>
        <div className="red-accent-bar center" />
        <p className="scene-body-text centered">
          The dust settles over the mountain basin. The pass is secure. The vanguard stands alone, unbroken.
        </p>
      </div>
    </section>
  );
}

export function Scene12ArmorySandbox() {
  const {
    sandboxModel,
    updateSandboxModel,
    sandboxLight,
    updateSandboxLight,
    sandboxPreset,
    updateSandboxPreset
  } = useExperience();

  return (
    <section className="film-scene" id="scene12" data-scene-index="11" data-act="IV">
      <div className="giant-bg-word" aria-hidden="true">ARMORY</div>
      <div className="scene-inner scene-layout-center">
        <div className="sandbox-instructions-card">
          <div className="caption-tracked">INTERACTIVE ARMORY SANDBOX</div>
          <h3 className="sandbox-title">FREE INSPECT MODE</h3>
          <p className="sandbox-help">Click and drag to orbit 360°. Scroll to inspect fine details.</p>

          {/* Control Strip */}
          <div className="sandbox-controls-strip">
            {/* Model Switcher */}
            <div className="control-group">
              <span className="control-label">ASSET:</span>
              <div className="btn-toggle-group">
                <button
                  className={`sandbox-model-btn ${sandboxModel === 'spartan' ? 'active' : ''}`}
                  onClick={() => updateSandboxModel('spartan')}
                  data-model="spartan"
                >
                  SPARTAN
                </button>
                <button
                  className={`sandbox-model-btn ${sandboxModel === 'rifle' ? 'active' : ''}`}
                  onClick={() => updateSandboxModel('rifle')}
                  data-model="rifle"
                >
                  RIFLE
                </button>
                <button
                  className={`sandbox-model-btn ${sandboxModel === 'machinegun' ? 'active' : ''}`}
                  onClick={() => updateSandboxModel('machinegun')}
                  data-model="machinegun"
                >
                  HEAVY MG
                </button>
              </div>
            </div>

            {/* Lighting Presets */}
            <div className="control-group">
              <span className="control-label">STUDIO RIG:</span>
              <div className="btn-toggle-group">
                <button
                  className={`sandbox-light-btn ${sandboxLight === 'studioLight' ? 'active' : ''}`}
                  onClick={() => updateSandboxLight('studioLight')}
                  data-light="studioLight"
                >
                  STUDIO
                </button>
                <button
                  className={`sandbox-light-btn ${sandboxLight === 'goldSolstice' ? 'active' : ''}`}
                  onClick={() => updateSandboxLight('goldSolstice')}
                  data-light="goldSolstice"
                >
                  SOLSTICE
                </button>
                <button
                  className={`sandbox-light-btn ${sandboxLight === 'nightBattle' ? 'active' : ''}`}
                  onClick={() => updateSandboxLight('nightBattle')}
                  data-light="nightBattle"
                >
                  NIGHT
                </button>
              </div>
            </div>

            {/* Camera Presets */}
            <div className="control-group">
              <span className="control-label">VIEWPORT:</span>
              <div className="btn-toggle-group">
                <button
                  className={`sandbox-preset-btn ${sandboxPreset === 'HERO' ? 'active' : ''}`}
                  onClick={() => updateSandboxPreset('HERO')}
                  data-preset="HERO"
                >
                  HERO
                </button>
                <button
                  className={`sandbox-preset-btn ${sandboxPreset === 'VISOR' ? 'active' : ''}`}
                  onClick={() => updateSandboxPreset('VISOR')}
                  data-preset="VISOR"
                >
                  VISOR
                </button>
                <button
                  className={`sandbox-preset-btn ${sandboxPreset === 'REAR' ? 'active' : ''}`}
                  onClick={() => updateSandboxPreset('REAR')}
                  data-preset="REAR"
                >
                  REAR
                </button>
                <button
                  className={`sandbox-preset-btn ${sandboxPreset === 'FULL' ? 'active' : ''}`}
                  onClick={() => updateSandboxPreset('FULL')}
                  data-preset="FULL"
                >
                  FULL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Scene13Finale() {
  const { triggerStartGame } = useExperience();
  const startBtnRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = startBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(btn, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    const btn = startBtnRef.current;
    if (!btn) return;
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)'
    });
  };

  return (
    <section className="film-scene scene-finale" id="scene13" data-scene-index="12" data-act="IV">
      <div className="giant-bg-word" aria-hidden="true">VANGUARD</div>
      <div className="scene-inner scene-layout-center">
        <div className="caption-tracked">TACTICAL DIRECTIVE: DEPLOYMENT READY</div>
        <h2 className="finale-title">THE LAST LINE IS YOURS.</h2>

        {/* Magnetic Start Game Button */}
        <div className="start-game-wrapper">
          <button
            ref={startBtnRef}
            id="start-game-btn"
            className="start-game-btn"
            aria-label="Start Game"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={triggerStartGame}
          >
            <span className="btn-frame-line top" />
            <span className="btn-frame-line right" />
            <span className="btn-frame-line bottom" />
            <span className="btn-frame-line left" />
            <span className="btn-pulse-glow" />
            <span className="btn-text">START GAME</span>
          </button>
        </div>

        {/* '71 Poster Tiny Tracked Credits Strip */}
        <footer className="film-credits-strip">
          <span className="credit-item">DIRECTED BY ANCIENT DISCIPLINE</span>
          <span className="credit-dot">•</span>
          <span className="credit-item">HARDENED TITANIUM-A COMPOSITE</span>
          <span className="credit-dot">•</span>
          <span className="credit-item">6.8MM KINETIC STABILIZATION</span>
          <span className="credit-dot">•</span>
          <span className="credit-item">THERMOPYLAE SECTOR DEFENSE</span>
          <span className="credit-dot">•</span>
          <span className="credit-item">ALL RIGHTS RESERVED MMXXVI</span>
        </footer>
      </div>
    </section>
  );
}
