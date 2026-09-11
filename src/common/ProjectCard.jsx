import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'framer-motion';

function ProjectCard({ src, link, h3, p, onClick }) {
  const reducedMotion = useReducedMotion();
  const frame = useRef(null);
  const pending = useRef(null);
  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the motion
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  // Map mouse position to rotation (max 12 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e) => {
    if (reducedMotion) return;
    pending.current = { target: e.currentTarget, x: e.clientX, y: e.clientY };
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const point = pending.current;
      const rect = point.target.getBoundingClientRect();
      x.set((point.x - rect.left) / Math.max(1, rect.width) - 0.5);
      y.set((point.y - rect.top) / Math.max(1, rect.height) - 0.5);
    });
  };

  const handleMouseLeave = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    x.set(0);
    y.set(0);
  };
  return (
    <motion.a 
      href={link || '#projects'}
      target="_blank" 
      rel="noopener noreferrer" 
      aria-haspopup="dialog"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      whileHover={reducedMotion ? undefined : {
        scale: 1.02, 
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
    >
      <div style={{ transform: "translateZ(30px)" }}>
        <img className="hover" src={src} alt={`${h3} logo`} loading="lazy" decoding="async" width="200" height="200" style={{ transform: "translateZ(40px)" }} />
        <h3>{h3}</h3>
        <p>{p}</p>
      </div>
    </motion.a>
  );
}

export default ProjectCard;
