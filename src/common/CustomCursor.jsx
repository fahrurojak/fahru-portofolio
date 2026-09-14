import { useEffect, useRef } from 'react';

const ENABLE_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const POINTER_SELECTOR = 'a[href], button, select, input:is([type="button"], [type="submit"], [type="reset"], [type="checkbox"], [type="radio"], [type="range"], [type="color"], [type="file"]), [role="button"], [data-cursor-magnetic]';
const TEXT_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, li, blockquote, code, pre, textarea, input:not([type]), input:is([type="text"], [type="email"], [type="search"], [type="url"], [type="tel"], [type="password"], [type="number"]), [contenteditable="true"]';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function CustomCursor() {
  const cursor = useRef(null);

  useEffect(() => {
    const media = window.matchMedia(ENABLE_QUERY);
    const element = cursor.current;
    const root = document.documentElement;
    let detach = () => {};

    const configure = () => {
      detach();
      element.style.opacity = '0';
      root.classList?.remove('has-custom-cursor');
      if (!media.matches) return;

      root.classList?.add('has-custom-cursor');
      let frame = null;
      let x = 0;
      let y = 0;
      let pointerX = 0;
      let pointerY = 0;
      let targetX = 0;
      let targetY = 0;
      let scale = 1;
      let targetScale = 1;
      let visible = false;
      let lastTime = 0;
      let magneticTarget = null;

      const setData = (name, value) => {
        if (element.dataset) element.dataset[name] = value;
      };
      const setSize = (width, height, radius) => {
        element.style.setProperty('--cursor-width', `${width}px`);
        element.style.setProperty('--cursor-height', `${height}px`);
        element.style.setProperty('--cursor-radius', radius);
      };
      const isDisabled = (target) => target?.matches?.(':disabled, [aria-disabled="true"]');
      const updateMagneticPosition = () => {
        if (!magneticTarget || magneticTarget.isConnected === false) {
          magneticTarget = null;
          targetX = pointerX;
          targetY = pointerY;
          return false;
        }

        const rect = magneticTarget.getBoundingClientRect?.();
        if (!rect || rect.width > 240 || rect.height > 96) {
          targetX = pointerX;
          targetY = pointerY;
          setSize(32, 32, '50%');
          return false;
        }

        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
        setSize(clamp(rect.width + 10, 28, 240), clamp(rect.height + 8, 28, 96), '10px');
        return true;
      };
      const setStateFromTarget = (target) => {
        const pointerTarget = target?.closest?.(POINTER_SELECTOR);
        if (pointerTarget && !isDisabled(pointerTarget)) {
          magneticTarget = pointerTarget;
          setData('state', 'pointer');
          updateMagneticPosition();
          return;
        }

        magneticTarget = null;
        const textTarget = target?.closest?.(TEXT_SELECTOR);
        if (textTarget) {
          setData('state', 'text');
          setSize(3, 28, '2px');
        } else {
          setData('state', 'default');
          setSize(22, 22, '50%');
        }
        targetX = pointerX;
        targetY = pointerY;
      };
      const paint = (time = 0) => {
        const elapsed = lastTime ? Math.min((time - lastTime) / 16.667, 2) : 1;
        lastTime = time;
        const follow = 1 - Math.pow(magneticTarget ? 0.64 : 0.52, elapsed);
        x += (targetX - x) * follow;
        y += (targetY - y) * follow;
        scale += (targetScale - scale) * Math.min(1, follow * 1.35);
        element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        element.style.opacity = '1';

        const remaining = Math.abs(targetX - x) + Math.abs(targetY - y) + Math.abs(targetScale - scale);
        if (remaining > 0.035 && visible && !document.hidden) {
          frame = requestAnimationFrame(paint);
        } else {
          x = targetX;
          y = targetY;
          scale = targetScale;
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
        pointerX = event.clientX;
        pointerY = event.clientY;
        setStateFromTarget(event.target);
        if (!visible) {
          x = targetX;
          y = targetY;
          visible = true;
        }
        startFrame();
      };
      const over = (event) => {
        setStateFromTarget(event.target);
        if (visible) startFrame();
      };
      const press = (event) => {
        if (event.pointerType !== 'mouse') return;
        targetScale = 0.86;
        setData('pressed', 'true');
        if (visible) startFrame();
      };
      const release = () => {
        targetScale = 1;
        setData('pressed', 'false');
        if (visible) startFrame();
      };
      const refreshMagneticTarget = () => {
        if (magneticTarget) {
          updateMagneticPosition();
          if (visible) startFrame();
        }
      };
      const hide = () => {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        visible = false;
        magneticTarget = null;
        targetScale = 1;
        lastTime = 0;
        element.style.opacity = '0';
        setData('pressed', 'false');
      };

      setData('state', 'default');
      setData('pressed', 'false');
      setSize(22, 22, '50%');
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('pointerover', over, { passive: true });
      window.addEventListener('pointerdown', press, { passive: true });
      window.addEventListener('pointerup', release, { passive: true });
      window.addEventListener('pointercancel', release, { passive: true });
      window.addEventListener('resize', refreshMagneticTarget, { passive: true });
      window.addEventListener('scroll', refreshMagneticTarget, { passive: true, capture: true });
      window.addEventListener('blur', hide);
      root.addEventListener('pointerleave', hide);
      document.addEventListener('visibilitychange', hide);

      detach = () => {
        hide();
        root.classList?.remove('has-custom-cursor');
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerover', over);
        window.removeEventListener('pointerdown', press);
        window.removeEventListener('pointerup', release);
        window.removeEventListener('pointercancel', release);
        window.removeEventListener('resize', refreshMagneticTarget);
        window.removeEventListener('scroll', refreshMagneticTarget, true);
        window.removeEventListener('blur', hide);
        root.removeEventListener('pointerleave', hide);
        document.removeEventListener('visibilitychange', hide);
      };
    };

    configure();
    media.addEventListener('change', configure);
    return () => {
      detach();
      media.removeEventListener('change', configure);
    };
  }, []);

  return <div ref={cursor} className="custom-cursor" aria-hidden="true" />;
}
