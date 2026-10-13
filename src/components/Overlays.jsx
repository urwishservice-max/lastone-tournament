import React from 'react';

export function Letterbox() {
  return (
    <>
      <div className="letterbox letterbox-top" aria-hidden="true" />
      <div className="letterbox letterbox-bottom" aria-hidden="true" />
    </>
  );
}

export function FilmGrain() {
  return (
    <>
      <div className="film-grain" aria-hidden="true" />
      <div className="vignette-overlay" aria-hidden="true" />
    </>
  );
}

export function DawnFlash({ isFlashing }) {
  return (
    <div
      id="dawn-flash"
      className={`dawn-flash-overlay ${isFlashing ? 'trigger-flash' : ''}`}
      aria-hidden="true"
    />
  );
}
