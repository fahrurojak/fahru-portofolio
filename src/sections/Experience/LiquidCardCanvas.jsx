import { useRef, useEffect } from 'react';

/**
 * 2-Color Dynamic Fluid Simulation Canvas
 * Simulates two immiscible/blendable fluids (Neon Lime & Dark Charcoal/Navy)
 * that slosh, swirl, and mix when agitated (dragged, tilted, or shaken).
 */
const LiquidCardCanvas = ({ rotateZ = 0, rotateX = 0, isDark = true }) => {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Physics and fluid state
  const stateRef = useRef({
    blobs: [],
    mixIntensity: 0,
    targetMix: 0,
    time: 0,
    prevAngleZ: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = 200;
    const height = 310;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Initialize fluid particles / blobs
    const blobCount = 12;
    const blobs = [];
    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: (width * 0.2) + Math.random() * (width * 0.25),
        baseRadius: (width * 0.2) + Math.random() * (width * 0.25),
        colorType: i % 2 === 0 ? 'lime' : 'dark', // 2 colors
        phase: Math.random() * Math.PI * 2,
        speed: 0.03 + Math.random() * 0.04,
      });
    }
    stateRef.current.blobs = blobs;

    // Listen to rotation changes to trigger agitation
    const angle = { z: 0 };
    if (rotateZ && typeof rotateZ.get === 'function') {
      angle.z = rotateZ.get();
      rotateZ.on('change', (v) => { angle.z = v; });
    }

    let lastTime = performance.now();

    const render = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const state = stateRef.current;
      state.time += dt * 2.5;

      // Agitation based on rotation speed/delta
      const dAngle = angle.z - state.prevAngleZ;
      state.prevAngleZ = angle.z;

      const motionSpeed = Math.abs(dAngle);
      if (motionSpeed > 0.5) {
        state.targetMix = Math.min(1, state.targetMix + motionSpeed * 0.04);
      }
      state.targetMix *= 0.95; // Decay
      state.mixIntensity += (state.targetMix - state.mixIntensity) * 0.1;

      const totalEnergy = Math.min(3.0, 0.3 + state.mixIntensity * 4.5);

      // Clear background
      ctx.clearRect(0, 0, width, height);

      // Base colors
      const limeBase = '#a3e635';
      const limeBright = '#bef264';
      const darkBase = isDark ? '#090d16' : '#1e293b';
      const darkAccent = isDark ? '#1e293b' : '#334155';

      // 1. Draw split layer gradient background
      const gradAngle = Math.PI / 4 + (angle.z * Math.PI) / 180 + Math.sin(state.time * 0.6) * (0.1 + state.mixIntensity * 0.4);
      const cx = width * 0.5;
      const cy = height * 0.5;
      const r = Math.max(width, height) * 0.75;

      const x0 = cx - Math.cos(gradAngle) * r;
      const y0 = cy - Math.sin(gradAngle) * r;
      const x1 = cx + Math.cos(gradAngle) * r;
      const y1 = cy + Math.sin(gradAngle) * r;

      const bgGrad = ctx.createLinearGradient(x0, y0, x1, y1);
      bgGrad.addColorStop(0, darkBase);
      bgGrad.addColorStop(0.45 + Math.sin(state.time * 0.8) * 0.08 * state.mixIntensity, darkAccent);
      bgGrad.addColorStop(0.55 + Math.cos(state.time) * 0.08 * state.mixIntensity, limeBright);
      bgGrad.addColorStop(1, limeBase);

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Liquid wave undulations
      const waveCount = 2;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const baseLevel = height * (0.45 + w * 0.1);
        const waveFreq = 0.012 + w * 0.006;
        const waveAmp = (12 + w * 8) * (1 + state.mixIntensity * 2.5);
        const waveSpeed = state.time * (2 + w);

        ctx.moveTo(0, height);
        ctx.lineTo(0, baseLevel);

        for (let x = 0; x <= width; x += 8) {
          const waveY =
            baseLevel +
            Math.sin(x * waveFreq + waveSpeed + angle.z * 0.02) * waveAmp +
            Math.cos(x * waveFreq * 0.6 - waveSpeed * 0.8) * (waveAmp * 0.4);
          ctx.lineTo(x, waveY);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const waveGrad = ctx.createLinearGradient(0, baseLevel - waveAmp, 0, height);
        if (w % 2 === 0) {
          waveGrad.addColorStop(0, 'rgba(163, 230, 53, 0.4)');
          waveGrad.addColorStop(1, 'rgba(190, 242, 100, 0.1)');
        } else {
          waveGrad.addColorStop(0, 'rgba(15, 23, 42, 0.35)');
          waveGrad.addColorStop(1, 'rgba(15, 23, 42, 0.05)');
        }
        ctx.fillStyle = waveGrad;
        ctx.fill();
      }

      // 3. Dynamic Fluid Blobs
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      blobs.forEach((b, idx) => {
        // Soft gravity pull based on rotation
        const gravityX = Math.sin((angle.z * Math.PI) / 180) * 0.15;
        const gravityY = Math.cos((angle.z * Math.PI) / 180) * 0.15;

        // Turbulence
        const turbulence = state.mixIntensity * 12;
        const turbX = Math.sin(state.time * 2.5 + idx) * turbulence;
        const turbY = Math.cos(state.time * 2.5 + idx * 1.2) * turbulence;

        b.vx += (gravityX + turbX) * dt;
        b.vy += (gravityY + turbY) * dt;

        // Swirling
        const swirlAngle = Math.atan2(b.y - height / 2, b.x - width / 2) + Math.PI / 2;
        const swirlForce = state.mixIntensity * 2;
        b.vx += Math.cos(swirlAngle) * swirlForce * dt;
        b.vy += Math.sin(swirlAngle) * swirlForce * dt;

        b.vx *= 0.95;
        b.vy *= 0.95;

        b.x += b.vx * totalEnergy;
        b.y += b.vy * totalEnergy;

        const pad = b.radius * 0.4;
        if (b.x < pad) { b.x = pad; b.vx *= -0.6; }
        if (b.x > width - pad) { b.x = width - pad; b.vx *= -0.6; }
        if (b.y < pad) { b.y = pad; b.vy *= -0.6; }
        if (b.y > height - pad) { b.y = height - pad; b.vy *= -0.6; }

        const currentRadius = b.baseRadius * (1 + Math.sin(state.time * b.speed + b.phase) * 0.15 * (1 + state.mixIntensity));

        const radGrad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, currentRadius);
        if (b.colorType === 'lime') {
          radGrad.addColorStop(0, 'rgba(190, 242, 100, 0.65)');
          radGrad.addColorStop(0.5, 'rgba(163, 230, 53, 0.3)');
          radGrad.addColorStop(1, 'rgba(163, 230, 53, 0)');
        } else {
          radGrad.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(30, 41, 59, 0.35)');
          radGrad.addColorStop(0.6, isDark ? 'rgba(15, 23, 42, 0.25)' : 'rgba(15, 23, 42, 0.1)');
          radGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        }

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [rotateZ, rotateX, isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default LiquidCardCanvas;
