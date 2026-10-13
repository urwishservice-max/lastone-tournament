/**
 * SPARTAN: LAST LINE
 * Particle Systems:
 * - 300 Red Phalanx Formation Points (Scene 05)
 * - Atmospheric Ash & Snow Drifting Points (Scenes 06, 09, 10)
 * 
 * Floating red bubble spheres have been completely removed.
 */

import * as THREE from 'three';

export function createParticleSystems() {
  const container = new THREE.Group();
  container.name = 'particle-systems';

  // --- 1. 300 Red Phalanx Formation Dots (Scene 05) ---
  const phalanxCount = 300;
  const phalanxGeo = new THREE.BufferGeometry();
  const phalanxPositions = new Float32Array(phalanxCount * 3);

  const cols = 25;
  const rows = 12;
  const spacingX = 0.14;
  const spacingZ = 0.12;

  for (let i = 0; i < phalanxCount; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = (col - cols / 2) * spacingX;
    const z = (row - rows / 2) * spacingZ;
    const y = 0.0;

    phalanxPositions[i * 3] = x;
    phalanxPositions[i * 3 + 1] = y;
    phalanxPositions[i * 3 + 2] = z;
  }

  phalanxGeo.setAttribute('position', new THREE.BufferAttribute(phalanxPositions, 3));

  // Circular point texture
  const dotCanvas = document.createElement('canvas');
  dotCanvas.width = 32;
  dotCanvas.height = 32;
  const dCtx = dotCanvas.getContext('2d');
  dCtx.beginPath();
  dCtx.arc(16, 16, 12, 0, Math.PI * 2);
  dCtx.fillStyle = '#D7263D';
  dCtx.fill();
  const dotTexture = new THREE.CanvasTexture(dotCanvas);

  const phalanxMat = new THREE.PointsMaterial({
    size: 0.04,
    map: dotTexture,
    transparent: true,
    opacity: 0.85,
    depthWrite: false
  });

  const phalanxPoints = new THREE.Points(phalanxGeo, phalanxMat);
  phalanxPoints.name = 'phalanx-points';
  phalanxPoints.visible = false;
  container.add(phalanxPoints);

  // --- 2. Ash & Snow Atmospheric Drift (Scenes 06, 09, 10) ---
  const ashCount = 500;
  const ashGeo = new THREE.BufferGeometry();
  const ashPositions = new Float32Array(ashCount * 3);
  const ashVelocities = [];

  for (let i = 0; i < ashCount; i++) {
    ashPositions[i * 3] = (Math.random() - 0.5) * 12;
    ashPositions[i * 3 + 1] = Math.random() * 8 - 1;
    ashPositions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    ashVelocities.push({
      y: -0.008 - Math.random() * 0.015,
      x: (Math.random() - 0.5) * 0.004,
      z: (Math.random() - 0.5) * 0.004
    });
  }

  ashGeo.setAttribute('position', new THREE.BufferAttribute(ashPositions, 3));

  const ashCanvas = document.createElement('canvas');
  ashCanvas.width = 32;
  ashCanvas.height = 32;
  const aCtx = ashCanvas.getContext('2d');
  aCtx.beginPath();
  aCtx.arc(16, 16, 12, 0, Math.PI * 2);
  aCtx.fillStyle = '#FFFFFF';
  aCtx.fill();
  const ashTexture = new THREE.CanvasTexture(ashCanvas);

  const ashMat = new THREE.PointsMaterial({
    size: 0.045,
    map: ashTexture,
    transparent: true,
    opacity: 0.35,
    color: 0xCCCCCC,
    depthWrite: false
  });

  const ashPoints = new THREE.Points(ashGeo, ashMat);
  ashPoints.name = 'ash-points';
  ashPoints.visible = false;
  container.add(ashPoints);

  // Animation Update loop
  container.tick = (delta, activeSceneId, scrollProgress) => {
    // 1. Phalanx visibility
    phalanxPoints.visible = (activeSceneId === 'scene05');
    if (phalanxPoints.visible) {
      phalanxPoints.rotation.y += delta * 0.08;
    }

    // 2. Ash Drift (Atmospheric snow/cinder in night & pass)
    const showAsh = (activeSceneId === 'scene06' || activeSceneId === 'scene09' || activeSceneId === 'scene10');
    ashPoints.visible = showAsh;

    if (showAsh) {
      const posArr = ashGeo.attributes.position.array;
      for (let i = 0; i < ashCount; i++) {
        posArr[i * 3 + 1] += ashVelocities[i].y;
        posArr[i * 3] += ashVelocities[i].x;
        posArr[i * 3 + 2] += ashVelocities[i].z;

        if (posArr[i * 3 + 1] < -1.5) {
          posArr[i * 3 + 1] = 6.5;
        }
      }
      ashGeo.attributes.position.needsUpdate = true;
    }
  };

  return container;
}
