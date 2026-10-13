/**
 * SPARTAN: LAST LINE
 * Tactical Grayscale World Map Plane
 * Scene 06 (The Oracle of the Map)
 * 
 * Clean, flat, military tactical terrain map.
 * Floating 3D red bubble spheres and 3D tube curves have been completely removed
 * per visual direction.
 */

import * as THREE from 'three';

export function createTacticalWorldMap() {
  const mapGroup = new THREE.Group();
  mapGroup.name = 'tactical-map';

  // Base Map Plane (16:9 ratio, matte grayscale)
  const planeGeo = new THREE.PlaneGeometry(6.4, 3.6, 32, 32);
  planeGeo.rotateX(-Math.PI / 2); // Lay flat on XZ plane

  // Tactical Canvas Texture with stylized vector coastlines and grid coordinates
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext('2d');

  function renderMapTexture(progress = 0) {
    // Background tone #E5E5E2
    ctx.fillStyle = '#E5E5E2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tactical coordinates & hairline grid
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;
    const step = 48;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Continental Landmasses (Stylized geometric vectors in #D3D3CE)
    ctx.fillStyle = '#D6D6D1';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1.2;

    // Mediterranean / Europe Basin
    ctx.beginPath();
    ctx.ellipse(490, 220, 95, 65, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Eurasia
    ctx.beginPath();
    ctx.ellipse(660, 200, 150, 75, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Americas
    ctx.beginPath();
    ctx.ellipse(220, 240, 75, 120, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Asia / Pacific
    ctx.beginPath();
    ctx.ellipse(780, 260, 110, 80, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Africa
    ctx.beginPath();
    ctx.ellipse(500, 340, 70, 95, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Clean Flat Tactical 2D Callouts on Map (Logistics reference style)
    // Thermopylae Sector Indicator
    ctx.fillStyle = '#D7263D';
    ctx.beginPath();
    ctx.arc(490, 220, 4, 0, Math.PI * 2);
    ctx.fill();

    // Subtle 2D Radar Ring
    ctx.strokeStyle = 'rgba(215, 38, 61, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(490, 220, 18, 0, Math.PI * 2);
    ctx.stroke();

    // Clean 1px hairline tactical indicator line
    ctx.strokeStyle = '#D7263D';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(490, 220);
    ctx.lineTo(550, 160);
    ctx.lineTo(630, 160);
    ctx.stroke();

    ctx.fillStyle = '#111111';
    ctx.font = 'bold 9px "Space Grotesk", monospace';
    ctx.fillText('PASS 01: THERMOPYLAE DEFENSE LINE', 555, 152);

    // Grid labels
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.font = '10px "Space Grotesk", monospace';
    ctx.fillText('SECTOR 04 // LAT 38°47\'N  LONG 22°32\'E', 30, 40);
    ctx.fillText('THERMOPYLAE ANCHOR BASELINE', 30, 55);
    ctx.fillText('GLOBAL TOPOGRAPHICAL GRID // SYNCHRONIZED', 680, 40);
  }

  renderMapTexture(0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;

  const mapMat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.85,
    metalness: 0.05,
    transparent: true,
    opacity: 0.95
  });

  const mapMesh = new THREE.Mesh(planeGeo, mapMat);
  mapMesh.receiveShadow = true;
  mapGroup.add(mapMesh);

  // Method to update bloom or progress if needed
  mapGroup.updateBloom = (progress) => {
    // Map is clean, minimal, and flat
  };

  return mapGroup;
}
