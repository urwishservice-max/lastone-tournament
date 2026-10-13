import React from 'react';

export function Scene07Rifle() {
  return (
    <section className="film-scene" id="scene07" data-scene-index="6" data-act="III">
      <div className="giant-bg-word" aria-hidden="true">ARSENAL</div>
      <div className="scene-inner scene-layout-split">
        <div className="split-left-editorial">
          <div className="caption-tracked">PRIMARY ARMAMENT // STANDARD ISSUE</div>
          <h2 className="display-title-stagger">
            <span className="title-line">KINETIC</span>
            <span className="title-line">PRECISION</span>
          </h2>
          <div className="red-accent-bar" />
          <p className="scene-body-text">
            Chambered in intermediate 6.8mm rounds. Gas-piston operated, balanced for point-target suppression
            under hostile atmospheric pressure.
          </p>

          {/* Weapon Specs Strip */}
          <div className="weapon-specs-strip">
            <div className="spec-col">
              <span className="spec-label">CALIBER</span>
              <span className="spec-val">6.8 × 43mm</span>
            </div>
            <div className="spec-col">
              <span className="spec-label">RATE OF FIRE</span>
              <span className="spec-val">850 RPM</span>
            </div>
            <div className="spec-col">
              <span className="spec-label">RANGE</span>
              <span className="spec-val">600 M</span>
            </div>
            <div className="spec-col">
              <span className="spec-label">WEIGHT</span>
              <span className="spec-val">3.4 KG</span>
            </div>
          </div>
        </div>

        <div className="split-right-callouts">
          <div className="weapon-part-callout">
            <span className="part-marker">+</span>
            <span className="part-name">COLD-FORGED FLUTED BARREL</span>
          </div>
          <div className="weapon-part-callout">
            <span className="part-marker">+</span>
            <span className="part-name">MAGNETIC COAXIAL RAIL</span>
          </div>
          <div className="weapon-part-callout">
            <span className="part-marker">+</span>
            <span className="part-name">HOLOGRAPHIC RED-DOT RETICLE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Scene08Heavy() {
  return (
    <section className="film-scene" id="scene08" data-scene-index="7" data-act="III">
      <div className="giant-bg-word" aria-hidden="true">SUPPRESSION</div>
      <div className="scene-inner scene-layout-right">
        <div className="heavy-weapon-card">
          <div className="caption-tracked">AREA DENIAL SYSTEM // SUSTAINED FIRE</div>
          <h2 className="display-title-stagger">
            <span className="title-line">HEAVY MACHINE GUN</span>
            <span className="title-line accent-text">M2 VANGUARD</span>
          </h2>
          <div className="red-accent-bar" />
          <p className="scene-body-text">
            Direct air-cooled, recoil-operated suppression system. Designed to shear through advancing horde waves
            at narrow choke points without overheating.
          </p>

          <div className="weapon-specs-strip">
            <div className="spec-col">
              <span className="spec-label">CARTRIDGE</span>
              <span className="spec-val">.50 BMG (12.7mm)</span>
            </div>
            <div className="spec-col">
              <span className="spec-label">MUZZLE VELOCITY</span>
              <span className="spec-val">890 m/s</span>
            </div>
            <div className="spec-col">
              <span className="spec-label">CYCLIC RATE</span>
              <span className="spec-val">600 RPM</span>
            </div>
            <div className="spec-col">
              <span className="spec-label">BARREL MASS</span>
              <span className="spec-val">11.0 KG</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
