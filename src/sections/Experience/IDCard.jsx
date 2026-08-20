import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import styles from './IDCard.module.css';
import photo from '../../assets/fahru.png';

function IDCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Directly map rotation from dummy's X to avoid double springs
  const rotateY = useTransform(x, [-200, 0, 200], [-180, 0, 180]);
  const rotateZ = useTransform(x, [-200, 0, 200], [-25, 0, 25]);
  
  // Map Y to a slight 3D tilt
  const rotateX = useTransform(y, [-200, 0, 200], [25, 0, -25]);

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
        <div className={styles.lanyardString}>
           <span className={styles.lanyardText}>FAHRU ROJAK</span>
        </div>
        <div className={styles.clip}></div>
        <motion.div 
          className={styles.cardInner}
          style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
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
        dragElastic={0.8}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 5 }} // Mantul-mantul physics
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
