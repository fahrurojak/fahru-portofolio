import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { clampTilt, foldPresentation, pointerTilt, remapOrientation } from './motion';
import './DuoFold.css';

const SETTLED_EPSILON = 0.015;

export default function DuoFold({ children }) {
  const surfaceRef = useRef(null);
  const frameRef = useRef(0);
  const motionRef = useRef({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    referenceBeta: null,
    referenceGamma: null,
    touchStartX: 0,
    touchStartY: 0,
    touching: false,
    lastTime: 0
  });
  const reducedMotion = useReducedMotion();
  const needsPermission = typeof window !== 'undefined'
    && typeof window.DeviceOrientationEvent?.requestPermission === 'function';
  const [sensorPermission, setSensorPermission] = useState(needsPermission ? 'prompt' : 'granted');

  const paint = useCallback(() => {
    const surface = surfaceRef.current;
    if (!surface) return;
    const state = motionRef.current;
    const { amount, direction } = foldPresentation(state.currentX, state.currentY);
    surface.style.setProperty('--duo-amount', amount.toFixed(4));
    surface.style.setProperty('--duo-direction', `${direction.toFixed(2)}deg`);
    surface.style.setProperty('--duo-blur', `${(1 + amount * 9).toFixed(2)}px`);
    surface.style.setProperty('--duo-darkness', (0.12 + amount * 0.38).toFixed(4));
    surface.style.setProperty('--duo-x', (state.currentX / 45).toFixed(4));
    surface.style.setProperty('--duo-y', (state.currentY / 45).toFixed(4));
    surface.style.setProperty('--glare-x', (state.currentX / 45).toFixed(4));
    surface.style.setProperty('--glare-y', (state.currentY / 45).toFixed(4));
    surface.dataset.folding = amount > 0.012 ? 'true' : 'false';
  }, []);

  const animate = useCallback((now) => {
    const state = motionRef.current;
    const dt = Math.min((now - (state.lastTime || now)) / 1000, 0.05);
    state.lastTime = now;
    const smoothing = 1 - Math.exp(-12 * dt);
    state.currentX += (state.targetX - state.currentX) * smoothing;
    state.currentY += (state.targetY - state.currentY) * smoothing;
    paint();
    const remaining = Math.abs(state.targetX - state.currentX) + Math.abs(state.targetY - state.currentY);
    if (remaining > SETTLED_EPSILON) {
      frameRef.current = requestAnimationFrame(animate);
    } else {
      state.currentX = state.targetX;
      state.currentY = state.targetY;
      state.lastTime = 0;
      paint();
      frameRef.current = 0;
    }
  }, [paint]);

  const setTarget = useCallback((x, y) => {
    if (reducedMotion) return;
    motionRef.current.targetX = clampTilt(x);
    motionRef.current.targetY = clampTilt(y);
    if (!frameRef.current) frameRef.current = requestAnimationFrame(animate);
  }, [animate, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      Object.assign(motionRef.current, { currentX: 0, currentY: 0, targetX: 0, targetY: 0 });
      paint();
      return undefined;
    }

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onPointerMove = event => {
      if (event.pointerType === 'mouse' && finePointer.matches) {
        const tilt = pointerTilt(event.clientX, event.clientY, window.innerWidth, window.innerHeight);
        setTarget(tilt.x, tilt.y);
      } else if (event.pointerType === 'touch' && motionRef.current.touching) {
        setTarget(
          (event.clientX - motionRef.current.touchStartX) * 0.28,
          (motionRef.current.touchStartY - event.clientY) * 0.28
        );
      }
    };
    const onPointerDown = event => {
      if (event.pointerType !== 'touch') return;
      motionRef.current.touching = true;
      motionRef.current.touchStartX = event.clientX;
      motionRef.current.touchStartY = event.clientY;
    };
    const onPointerEnd = event => {
      if (event.pointerType !== 'touch') return;
      motionRef.current.touching = false;
      setTarget(0, 0);
    };
    const onPointerLeave = event => {
      if (event.pointerType === 'mouse') setTarget(0, 0);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerEnd, { passive: true });
    window.addEventListener('pointercancel', onPointerEnd, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [paint, reducedMotion, setTarget]);

  useEffect(() => {
    if (reducedMotion || sensorPermission !== 'granted') return undefined;
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    if (!coarsePointer.matches || !('DeviceOrientationEvent' in window)) return undefined;

    const onOrientation = event => {
      if (event.beta == null || event.gamma == null) return;
      const state = motionRef.current;
      if (state.referenceBeta == null || state.referenceGamma == null) {
        state.referenceBeta = event.beta;
        state.referenceGamma = event.gamma;
        return;
      }
      const angle = window.screen.orientation?.angle || window.orientation || 0;
      const tilt = remapOrientation(
        event.beta - state.referenceBeta,
        event.gamma - state.referenceGamma,
        angle
      );
      setTarget(tilt.x, -tilt.y);
    };
    const recalibrate = () => {
      motionRef.current.referenceBeta = null;
      motionRef.current.referenceGamma = null;
      setTarget(0, 0);
    };

    window.addEventListener('deviceorientation', onOrientation, { passive: true });
    window.screen.orientation?.addEventListener?.('change', recalibrate);
    return () => {
      window.removeEventListener('deviceorientation', onOrientation);
      window.screen.orientation?.removeEventListener?.('change', recalibrate);
    };
  }, [reducedMotion, sensorPermission, setTarget]);

  const enableMotion = async () => {
    try {
      const result = await window.DeviceOrientationEvent.requestPermission();
      setSensorPermission(result === 'granted' ? 'granted' : 'denied');
    } catch {
      setSensorPermission('denied');
    }
  };

  return (
    <div className="duo-fold" ref={surfaceRef} data-folding="false">
      {children}
      <div className="duo-fold__glass" aria-hidden="true" />
      <div className="duo-fold__shade" aria-hidden="true" />
      {sensorPermission === 'prompt' && !reducedMotion && (
        <button type="button" className="duo-fold__permission" onClick={enableMotion}>
          Aktifkan efek gerak
        </button>
      )}
    </div>
  );
}
