import React from 'react';

export function Scene05HotGates() {
  return (
    <section className="film-scene" id="scene05" data-scene-index="4" data-act="II">
      <div className="giant-bg-word" aria-hidden="true">480 BC</div>
      <div className="scene-inner scene-layout-center">
        {/* Cinematic Photo Strip */}
        <div className="cinematic-photo-strip">
          <div className="strip-marker">FLASHBACK ARCHIVE // THERMOPYLAE</div>
          <div className="strip-image-placeholder">
            <span className="strip-text-overlay">NARROW SHORES OF MALIS // 300 STAND AGAINST TEN THOUSAND</span>
          </div>
        </div>

        <blockquote className="ancient-quote-block">
          <p className="quote-text">
            “The Spartans do not ask how many the enemy are, but where they are.”
          </p>
          <cite className="quote-author">PLUTARCH, MORALIA (SAYINGS OF SPARTANS)</cite>
        </blockquote>

        <div className="phalanx-dots-caption">
          <span className="red-dot-indicator" />
          <span>300 RED DOTS IN INTERLOCKING PHALANX FORMATION</span>
        </div>
      </div>
    </section>
  );
}

export function Scene06OracleMap() {
  return (
    <section className="film-scene" id="scene06" data-scene-index="5" data-act="II">
      <div className="giant-bg-word" aria-hidden="true">2500 YR</div>
      <div className="scene-inner scene-layout-split">
        <div className="split-left-editorial">
          <div className="time-jump-badge">TIME JUMP: 2,500 YEARS LATER</div>
          <h2 className="display-title-stagger">
            <span className="title-line">ONE MAP.</span>
            <span className="title-line">THE WORLD OVERRUN.</span>
            <span className="title-line accent-text">ONE CHANCE.</span>
          </h2>
          <div className="red-accent-bar" />
          <p className="scene-body-text">
            Satellite feeds confirm infection saturation across all six continents. Communication grids have gone dark.
            Only a single survivor vector remains open across the mountain pass.
          </p>
          <div className="tactical-legend">
            <div className="legend-item"><span className="legend-dot red" /> INFECTION EPICENTERS</div>
            <div className="legend-item"><span className="legend-line red" /> EXTRACTION ROUTE</div>
          </div>
        </div>

        <div className="split-right-telemetry">
          <div className="map-hud-box">
            <div className="box-header">CONTAGION VECTOR SPREAD</div>
            <div className="box-stat">CLUSTER SECTOR: ZERO</div>
            <div className="box-stat">PASS THICKNESS: 14.2 KM</div>
            <div className="box-status blink">EVACUATION CORRIDOR CLOSING</div>
          </div>
        </div>
      </div>
    </section>
  );
}
