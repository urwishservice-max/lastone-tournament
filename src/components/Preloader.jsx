import React from 'react';
import { useExperience } from '../context/ExperienceContext';

export default function Preloader() {
  const { preloadProgress, isPreloadDone } = useExperience();

  return (
    <div
      id="preloader"
      className={`preloader ${isPreloadDone ? 'fade-out' : ''}`}
      aria-hidden={isPreloadDone}
    >
      <div className="preloader-inner">
        <div className="preloader-plus">+</div>
        <div className="preloader-title">SPARTAN: LAST LINE</div>
        <div className="preloader-counter" id="preloader-counter">
          {preloadProgress.toString().padStart(3, '0')}%
        </div>
        <div className="preloader-bar">
          <div
            className="preloader-progress"
            id="preloader-progress"
            style={{ width: `${preloadProgress}%` }}
          />
        </div>
        <div className="preloader-caption">SYNCHRONIZING TACTICAL DATA</div>
      </div>
    </div>
  );
}
