import React from 'react';
import { useExperience } from '../../context/ExperienceContext';

export function Scene01Silence() {
  return (
    <section className="film-scene" id="scene01" data-scene-index="0" data-act="I">
      <div className="scene-inner scene-center">
        <div className="tactical-crosshair-center">+</div>
        <div className="hairline-horizontal" />
        <div className="caption-tracked">THERMOPYLAE TO REACH</div>
        <h1 className="scene-statement">
          SOME WARS NEVER END.<br />
          <span className="accent-text">THEY WAIT.</span>
        </h1>
        <div className="scroll-prompt-badge">
          <span className="pulse-dot" />
          <span>INITIATE DESCENT</span>
        </div>
      </div>
    </section>
  );
}

export function Scene02Awakening() {
  return (
    <section className="film-scene" id="scene02" data-scene-index="1" data-act="I">
      <div className="giant-bg-word" aria-hidden="true">SPARTAN</div>
      <div className="scene-inner scene-layout-center">
        <div className="caption-tracked">OPERATIONAL DESIGNATION: VANGUARD-01</div>
        <h2 className="display-title-stagger">
          <span className="title-line">THE IMMORTAL</span>
          <span className="title-line">VANGUARD</span>
        </h2>
        <div className="red-accent-bar" />
        <p className="scene-body-text">
          Awoken from cryogenic suspension into a silent, zero-visibility corridor. No allied signatures detected.
          Armor diagnostics at nominal voltage. Visual telemetry calibrating gold polarizing shield.
        </p>
      </div>
    </section>
  );
}

export function Scene03Aegis() {
  const { enterMacro } = useExperience();

  return (
    <section className="film-scene" id="scene03" data-scene-index="2" data-act="I">
      <div className="giant-bg-word" aria-hidden="true">AEGIS</div>
      <div className="scene-inner scene-layout-split">
        <div className="split-left-callouts">
          {/* Callout 1: Visor */}
          <div
            className="tactical-callout callout-visor interactive-callout"
            data-closeup="visor"
            tabIndex={0}
            role="button"
            aria-label="Extreme close-up on Polarized Gold Visor"
            onClick={() => enterMacro('visor')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') enterMacro('visor'); }}
          >
            <div className="callout-pointer">
              <span className="callout-dot" />
              <span className="callout-line" />
            </div>
            <div className="callout-card">
              <div className="callout-card-header">
                <span className="callout-tag">OPTICAL SUBSYSTEM</span>
                <span className="callout-action-badge"><span className="badge-icon">⌕</span> CLOSE-UP</span>
              </div>
              <h4 className="callout-heading">POLARIZED GOLD PHOTONIC VISOR</h4>
              <p className="callout-desc">Full-spectrum thermal/EM filtering with integrated tactical HUD projection.</p>
              <div className="callout-click-hint">CLICK TO ZOOM IN &bull; 4.8X MACRO</div>
            </div>
          </div>

          {/* Callout 2: Chest */}
          <div
            className="tactical-callout callout-plating interactive-callout"
            data-closeup="chest"
            tabIndex={0}
            role="button"
            aria-label="Extreme close-up on Titanium Chest Carapace"
            onClick={() => enterMacro('chest')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') enterMacro('chest'); }}
          >
            <div className="callout-pointer">
              <span className="callout-dot" />
              <span className="callout-line" />
            </div>
            <div className="callout-card">
              <div className="callout-card-header">
                <span className="callout-tag">CHEST CARAPACE</span>
                <span className="callout-action-badge"><span className="badge-icon">⌕</span> CLOSE-UP</span>
              </div>
              <h4 className="callout-heading">TITANIUM-A METAL MATRIX</h4>
              <p className="callout-desc">High-density composite matrix engineered for extreme point-blank kinetic trauma.</p>
              <div className="callout-click-hint">CLICK TO ZOOM IN &bull; 4.2X MACRO</div>
            </div>
          </div>

          {/* Callout 3: Side */}
          <div
            className="tactical-callout callout-dissipation interactive-callout"
            data-closeup="side"
            tabIndex={0}
            role="button"
            aria-label="Extreme close-up on Side Kinetic Dissipation"
            onClick={() => enterMacro('side')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') enterMacro('side'); }}
          >
            <div className="callout-pointer">
              <span className="callout-dot" />
              <span className="callout-line" />
            </div>
            <div className="callout-card">
              <div className="callout-card-header">
                <span className="callout-tag">SHIELD SYSTEM</span>
                <span className="callout-action-badge"><span className="badge-icon">⌕</span> CLOSE-UP</span>
              </div>
              <h4 className="callout-heading">12,400 J KINETIC DISSIPATION</h4>
              <p className="callout-desc">Sub-surface energy dispersion coils preventing localized armor perforation.</p>
              <div className="callout-click-hint">CLICK TO ZOOM IN &bull; 3.9X MACRO</div>
            </div>
          </div>
        </div>

        <div className="split-right-editorial">
          <div className="caption-tracked">DEFENSIVE PROTOCOL // D-03</div>
          <blockquote className="editorial-quote">
            “WITH SHIELD OR ON IT.”
          </blockquote>
          <p className="editorial-body">
            The hoplite’s bronze and the modern operator’s titanium share the same doctrine: the barrier between life
            and annihilation is held with two hands.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Scene04Body() {
  const { stats } = useExperience();

  return (
    <section className="film-scene" id="scene04" data-scene-index="3" data-act="I">
      <div className="giant-bg-word" aria-hidden="true">300</div>
      <div className="scene-inner scene-layout-right">
        <div className="stats-panel-card">
          <div className="caption-tracked">PHYSIOLOGICAL & BIOMECHANICAL TELEMETRY</div>
          <h3 className="panel-headline">VANGUARD CAPACITY</h3>

          <div className="stat-row">
            <div className="stat-number" id="stat-cohesion">{stats.cohesion}</div>
            <div className="stat-info">
              <span className="stat-label">PHALANX COHESION</span>
              <span className="stat-sub">Zero structural deviation across shock points</span>
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-number" id="stat-resistance">{stats.resistance}</div>
            <div className="stat-info">
              <span className="stat-label">FRONTAL RESISTANCE</span>
              <span className="stat-sub">Peak kinetic deflection against wave momentum</span>
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-number" id="stat-velocity">{stats.velocity}</div>
            <div className="stat-info">
              <span className="stat-label">STRIKE VELOCITY</span>
              <span className="stat-sub">Hydraulic-assisted weapon acceleration</span>
            </div>
          </div>

          <div className="stat-row">
            <div className="stat-number" id="stat-hardness">{stats.hardness}</div>
            <div className="stat-info">
              <span className="stat-label">ARMOR HARDNESS</span>
              <span className="stat-sub">Vacuum-hardened diamond alloy surface</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
