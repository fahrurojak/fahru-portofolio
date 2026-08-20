import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useScroll, useVelocity } from 'framer-motion';
import styles from './IDCard.module.css';
import photo from '../../assets/fahru.png';

function IDCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Scroll swaying physics
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  // Calculate drag velocities for chaotic physics
  const xVelocity = useVelocity(x);
  const yVelocity = useVelocity(y);

  // Combine Drag, Scroll, and Subtle Velocity for Rotations
  const rotateZ = useTransform(() => {
    const dragZ = (x.get() / 200) * 25; // Gentle swing left/right
    const scrollZ = (smoothVelocity.get() / 1000) * 10; // Gentle sway on scroll
    const bounceSwing = (yVelocity.get() / 1000) * 5; // Very slight wobble on vertical snap
    return dragZ + scrollZ + bounceSwing;
  });

  const rotateX = useTransform(() => {
    const dragX = (y.get() / 200) * -15; // Gentle tilt forward/backward
    const scrollX = (smoothVelocity.get() / 1000) * 15; // Gentle tilt on scroll
    const bounceTilt = (xVelocity.get() / 1000) * 5; // Very slight wobble on sideways snap
    return dragX + scrollX + bounceTilt;
  });

  // Only map X to rotateY, reduced to 90deg so it doesn't spin completely around wildly
  const rotateY = useTransform(x, [-200, 0, 200], [-90, 0, 90]);

  // Stretch the string realistically (prevent extreme stretching)
  const stringScaleY = useTransform(y, (latestY) => {
    const safeY = Math.max(-30, latestY); // Prevent the string from compressing into nothing
    return (180 + safeY) / 180;
  });

  return (
    <div className={styles.lanyardContainer} style={{ cursor: "grab" }}>
      {/* 1. VISUAL ELEMENT (NO drag, NO translation) */}
      <motion.div
        className={styles.cardWrapper}
        style={{ 
          rotateZ,
          transformOrigin: "top center",
          pointerEvents: "none" // Let mouse clicks pass through to dummy
        }}
      >
        <motion.div 
          className={styles.lanyardString}
          style={{ scaleY: stringScaleY, transformOrigin: "top center" }}
        >
           <span className={styles.lanyardText}>FAHRU ROJAK</span>
        </motion.div>
        
        <motion.div className={styles.clip} style={{ y }}></motion.div>
        
        <motion.div 
          className={styles.cardInner}
          style={{ y, rotateY, rotateX, transformStyle: "preserve-3d" }}
        >
          {/* FRONT */}
          <div className={styles.cardFront}>
            <div className={styles.holeContainer}>
              <div className={styles.hole}></div>
            </div>
            <div className={styles.cardTopCurve}>
              <img src={photo} alt="Fahru Rojak" className={styles.photo} />
            </div>
            <div className={styles.cardBottom}>
              <div className={styles.cardText}>
                <h4>Fahru Rojak</h4>
                <div className={styles.statusWrapper}>
                  <div className={styles.blinkingDot}></div>
                  <p>OPEN TO WORK</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* BACK */}
          <div className={styles.cardBack}>
            <div className={styles.backContent}>
              <h3>Fahru Rojak</h3>
              <p>Scan to Connect!</p>
              <div className={styles.qrCodePlaceholder}></div>
              <p className={styles.quote}>"Keep Coding, Keep Building"</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 2. INVISIBLE DRAG TARGET */}
      <motion.div
        drag
        dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        dragElastic={0.2} // Stiff elastic like a real taut string
        dragTransition={{ bounceStiffness: 300, bounceDamping: 15 }} // Realistic damping, less wild bouncing
        style={{ 
          x, y,
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0, // Cover the entire container
          zIndex: 20,
          opacity: 0 // Completely invisible but catches drag events
        }}
        whileTap={{ cursor: "grabbing" }}
      />
    </div>
  );
}

export default IDCard;
