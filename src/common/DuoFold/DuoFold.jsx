import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  clampTilt,
  foldPresentation,
  pointerTilt,
  predictTilt,
  remapOrientation,
  renderingQuality,
  shortestAngleDelta,
  stabilizeTilt
} from './motion';
import './DuoFold.css';

const SETTLED_EPSILON = 0.012;
const RECENTER_SECONDS = 15;
const STILL_RATE = 2;

function getScreenAngle() {
  return window.screen.orientation?.angle || window.orientation || 0;
}

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
    gyroX: 0,
    gyroY: 0,
    lastSensorTime: 0,
    touchStartX: 0,
    touchStartY: 0,
    touching: false,
    sensorActive: false,
    foldingActive: false,
    lastFrameTime: 0
  });
  const reducedMotion = useReducedMotion();
  const needsPermission = typeof window !== 'undefined' && (
    typeof window.DeviceOrientationEvent?.requestPermission === 'function'
    || typeof window.DeviceMotionEvent?.requestPermission === 'function'
  );
  const [sensorPermission, setSensorPermission] = useState(needsPermission ? 'prompt' : 'granted');
  const [quality] = useState(() => {
    if (typeof navigator === 'undefined') return 'high';
    return renderingQuality({
      deviceMemory: navigator.deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      saveData: navigator.connection?.saveData,
      coarsePointer: window.matchMedia?.('(pointer: coarse)').matches
    });
  });

  const paint = useCallback(() => {
    const surface = surfaceRef.current;
    if (!surface) return;
    const state = motionRef.current;
    const presentation = foldPresentation(state.currentX, state.currentY);
    const { amount, direction, soft, medium, strong } = presentation;
    const directionStep = quality === 'lite' ? 8 : quality === 'balanced' ? 4 : 2;
    const stableDirection = Math.round(direction / directionStep) * directionStep;

    // One inline-style write avoids triggering a separate style invalidation
    // for every custom property on sensor-heavy mobile browsers.
    surface.style.cssText = [
      `--duo-amount:${amount.toFixed(4)}`,
      `--duo-soft:${soft.toFixed(4)}`,
      `--duo-medium:${medium.toFixed(4)}`,
      `--duo-strong:${strong.toFixed(4)}`,
      `--duo-direction:${stableDirection}deg`,
      `--duo-darkness:${(0.08 + amount * 0.48).toFixed(4)}`,
      `--duo-grain:${(amount * 0.16).toFixed(4)}`,
      `--glare-x:${(state.currentX / 45).toFixed(4)}`,
      `--glare-y:${(state.currentY / 45).toFixed(4)}`
    ].join(';');
    if (!state.foldingActive && amount > 0.035) state.foldingActive = true;
    if (state.foldingActive && amount < 0.007) state.foldingActive = false;
    surface.dataset.folding = state.foldingActive ? 'true' : 'false';
  }, [quality]);

  const animate = useCallback((now) => {
    const state = motionRef.current;
    const dt = Math.min((now - (state.lastFrameTime || now)) / 1000, 0.05);
    state.lastFrameTime = now;
    const smoothing = 1 - Math.exp(-(quality === 'high' ? 13 : 10) * dt);
    state.currentX += (state.targetX - state.currentX) * smoothing;
    state.currentY += (state.targetY - state.currentY) * smoothing;
    paint();

    const remaining = Math.abs(state.targetX - state.currentX) + Math.abs(state.targetY - state.currentY);
    if (remaining > SETTLED_EPSILON) {
      frameRef.current = requestAnimationFrame(animate);
      return;
    }
    state.currentX = state.targetX;
    state.currentY = state.targetY;
    state.lastFrameTime = 0;
    paint();
    frameRef.current = 0;
  }, [paint, quality]);

  const setTarget = useCallback((x, y) => {
    if (reducedMotion) return;
    motionRef.current.targetX = clampTilt(x);
    motionRef.current.targetY = clampTilt(y);
    if (!frameRef.current) frameRef.current = requestAnimationFrame(animate);
  }, [animate, reducedMotion]);

  const recalibrate = useCallback(() => {
    const state = motionRef.current;
    state.referenceBeta = null;
    state.referenceGamma = null;
    state.gyroX = 0;
    state.gyroY = 0;
    state.lastSensorTime = 0;
    setTarget(0, 0);
  }, [setTarget]);

  useEffect(() => {
    if (reducedMotion) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      Object.assign(motionRef.current, {
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0,
        lastFrameTime: 0
      });
      paint();
      return undefined;
    }

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onPointerMove = event => {
      if (event.pointerType === 'mouse' && finePointer.matches) {
        const tilt = pointerTilt(event.clientX, event.clientY, window.innerWidth, window.innerHeight);
        setTarget(tilt.x, tilt.y);
      } else if (event.pointerType === 'touch' && motionRef.current.touching && !motionRef.current.sensorActive) {
        setTarget(
          (event.clientX - motionRef.current.touchStartX) * 0.3,
          (motionRef.current.touchStartY - event.clientY) * 0.3
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
      if (!motionRef.current.sensorActive) setTarget(0, 0);
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
  }, [paint, reducedMotion, sensorPermission, setTarget]);

  useEffect(() => {
    if (reducedMotion || sensorPermission !== 'granted') return undefined;
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    if (!coarsePointer.matches || !('DeviceOrientationEvent' in window)) return undefined;

    const onMotion = event => {
      const rate = event.rotationRate;
      if (!rate) return;
      const remapped = remapOrientation(rate.beta || 0, rate.gamma || 0, getScreenAngle());
      const state = motionRef.current;
      state.gyroX += (remapped.x - state.gyroX) * 0.24;
      state.gyroY += (-remapped.y - state.gyroY) * 0.24;
    };

    const onOrientation = event => {
      if (event.beta == null || event.gamma == null) return;
      const state = motionRef.current;
      state.sensorActive = true;
      const now = event.timeStamp || performance.now();
      if (state.referenceBeta == null || state.referenceGamma == null) {
        state.referenceBeta = event.beta;
        state.referenceGamma = event.gamma;
        state.lastSensorTime = now;
        return;
      }

      const elapsed = Math.min(Math.max((now - state.lastSensorTime) / 1000, 0), 0.25);
      state.lastSensorTime = now;
      const speed = Math.hypot(state.gyroX, state.gyroY);
      if (speed < STILL_RATE && elapsed > 0) {
        const recenter = Math.min(elapsed / RECENTER_SECONDS, 1);
        state.referenceBeta += shortestAngleDelta(event.beta, state.referenceBeta) * recenter;
        state.referenceGamma += shortestAngleDelta(event.gamma, state.referenceGamma) * recenter;
      }

      const measured = remapOrientation(
        shortestAngleDelta(event.beta, state.referenceBeta),
        shortestAngleDelta(event.gamma, state.referenceGamma),
        getScreenAngle()
      );
      setTarget(
        stabilizeTilt(predictTilt(measured.x, state.gyroX)),
        stabilizeTilt(predictTilt(-measured.y, state.gyroY))
      );
    };

    const onVisibility = () => {
      if (document.hidden) recalibrate();
    };
    window.addEventListener('devicemotion', onMotion, { passive: true });
    window.addEventListener('deviceorientation', onOrientation, { passive: true });
    window.screen.orientation?.addEventListener?.('change', recalibrate);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('devicemotion', onMotion);
      window.removeEventListener('deviceorientation', onOrientation);
      window.screen.orientation?.removeEventListener?.('change', recalibrate);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [recalibrate, reducedMotion, sensorPermission, setTarget]);

  const enableMotion = async () => {
    try {
      // Start both permission requests inside the same user gesture; Safari can
      // reject the second request if it is started after awaiting the first.
      const orientationRequest = typeof window.DeviceOrientationEvent?.requestPermission === 'function'
        ? window.DeviceOrientationEvent.requestPermission()
        : Promise.resolve('granted');
      const motionRequest = typeof window.DeviceMotionEvent?.requestPermission === 'function'
        ? window.DeviceMotionEvent.requestPermission()
        : Promise.resolve('granted');
      const [orientationResult] = await Promise.all([
        orientationRequest,
        motionRequest.catch(() => 'denied')
      ]);
      setSensorPermission(orientationResult === 'granted' ? 'granted' : 'denied');
    } catch {
      setSensorPermission('denied');
    }
  };

  return (
    <div className="duo-fold" ref={surfaceRef} data-folding="false" data-quality={quality}>
      {children}
      <div className="duo-fold__glass duo-fold__glass--soft" aria-hidden="true" />
      <div className="duo-fold__glass duo-fold__glass--medium" aria-hidden="true" />
      <div className="duo-fold__glass duo-fold__glass--strong" aria-hidden="true" />
      <div className="duo-fold__frost" aria-hidden="true" />
      <div className="duo-fold__shade" aria-hidden="true" />
      {sensorPermission === 'prompt' && !reducedMotion && (
        <button type="button" className="duo-fold__permission" onClick={enableMotion}>
          Aktifkan efek gerak
        </button>
      )}
    </div>
  );
}
