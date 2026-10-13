import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power1.out'
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    const onMouseEnter = () => document.body.classList.add('cursor-hover');
    const onMouseLeave = () => document.body.classList.remove('cursor-hover');

    const updateHoverListeners = () => {
      const hoverElements = document.querySelectorAll('button, a, .act-nav-item, .stat-row, .tactical-callout, .area-chip');
      hoverElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });
    };

    updateHoverListeners();
    const observer = new MutationObserver(updateHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
      document.body.classList.remove('cursor-hover');
    };
  }, []);

  return (
    <div id="custom-cursor" className="custom-cursor" ref={cursorRef} aria-hidden="true">
      <div className="cursor-dot" />
      <div className="cursor-ring" />
    </div>
  );
}
