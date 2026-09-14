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
      let x = 0, y = 0, targetX = 0, targetY = 0;
      let scale = 1, targetScale = 1, visible = false, lastTime = 0;
      const paint = (time = 0) => {
        const elapsed = lastTime ? Math.min((time - lastTime) / 16.667, 2) : 1;
        lastTime = time;
        const follow = 1 - Math.pow(0.72, elapsed);
        x += (targetX - x) * follow;
        y += (targetY - y) * follow;
        scale += (targetScale - scale) * Math.min(1, follow * 1.4);
        element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        element.style.opacity = '1';
        const remaining = Math.abs(targetX - x) + Math.abs(targetY - y) + Math.abs(targetScale - scale);
        if (remaining > 0.04 && visible && !document.hidden) {
          frame = requestAnimationFrame(paint);
        } else {
          x = targetX; y = targetY; scale = targetScale;
          element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
          frame = null;
          lastTime = 0;
        }
      };
      const startFrame = () => {
        if (frame === null) frame = requestAnimationFrame(paint);
      };
      const move = (event) => {
        if (event.pointerType !== 'mouse' || document.hidden) return;
        targetX = event.clientX; targetY = event.clientY;
        if (!visible) {
          x = targetX; y = targetY; visible = true;
        }
        startFrame();
      };
      const over = (event) => {
        targetScale = event.target.closest?.('a, button, input, [role="button"]') ? 1.4 : 1;
        if (visible) startFrame();
      };
      const hide = () => {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        visible = false;
        lastTime = 0;
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
