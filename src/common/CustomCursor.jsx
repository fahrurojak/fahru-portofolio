import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursor = useRef(null);
  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const element = cursor.current;
    let detach = () => {};
    const configure = () => {
      detach();
      element.style.opacity = '0';
      if (!media.matches) return;
      let frame = null;
      let x = 0, y = 0, scale = 1;
      const paint = () => {
        frame = null;
        element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
        element.style.opacity = '1';
      };
      const move = (event) => {
        if (event.pointerType !== 'mouse' || document.hidden) return;
        x = event.clientX; y = event.clientY;
        if (frame === null) frame = requestAnimationFrame(paint);
      };
      const over = (event) => { scale = event.target.closest?.('a, button, input, [role="button"]') ? 1.4 : 1; };
      const hide = () => {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        element.style.opacity = '0';
      };
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('pointerover', over, { passive: true });
      window.addEventListener('blur', hide);
      document.documentElement.addEventListener('pointerleave', hide);
      document.addEventListener('visibilitychange', hide);
      detach = () => {
        hide();
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerover', over);
        window.removeEventListener('blur', hide);
        document.documentElement.removeEventListener('pointerleave', hide);
        document.removeEventListener('visibilitychange', hide);
      };
    };
    configure();
    media.addEventListener('change', configure);
    return () => { detach(); media.removeEventListener('change', configure); };
  }, []);
  return <div ref={cursor} className="custom-cursor" aria-hidden="true" />;
}
