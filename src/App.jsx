import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import './App.css';
import Contact from './sections/Contact/Contact';
import Footer from './sections/Footer/Footer';
import Hero from './sections/Hero/Hero';
import Projects from './sections/Projects/Projects';
import Skills from './sections/Skills/Skills';
import NavigationBar from './common/NavigationBar/NavigationBar';
import LiquidBackground from './common/LiquidBackground/LiquidBackground';
import GlobalControls from './common/GlobalControls/GlobalControls';
import Experience from './sections/Experience/Experience';

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(0); // Start hidden until mouse moves
  const springScale = useSpring(scale, { stiffness: 400, damping: 25 });
  const springOpacity = useSpring(opacity, { stiffness: 300, damping: 20 });

  useEffect(() => {

    const moveCursor = (e) => {
      const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
      
      if (clientX !== undefined && clientY !== undefined) {
        cursorX.set(clientX);
        cursorY.set(clientY);
        if (opacity.get() === 0) opacity.set(1); // Show cursor when moving
      }
    };

    const handleMouseLeave = () => {
      opacity.set(0); // Hide when mouse leaves window
    };

    const handleMouseEnter = () => {
      opacity.set(1); // Show when mouse enters window
    };

    const handleTouchEnd = () => {
      opacity.set(0); // Hide when finger leaves phone screen
    };

    const handleMouseOver = (e) => {
      const isHoverable = e.target.closest('a, button, input, [role="button"], .hover, .glass-panel, img');
      if (isHoverable) {
        scale.set(2);
      } else {
        scale.set(1);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('touchmove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('touchstart', handleMouseOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    document.documentElement.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.documentElement.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('touchmove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('touchstart', handleMouseOver);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.removeEventListener('touchend', handleTouchEnd);
      document.documentElement.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [cursorX, cursorY, scale, opacity]);

  return (
    <motion.div
      className="custom-cursor"
      style={{
        x: cursorX,
        y: cursorY,
        scale: springScale,
        opacity: springOpacity,
        translateX: "-50%",
        translateY: "-50%"
      }}
    />
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    let rafId = null;
    const handleMouseMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
        document.documentElement.style.setProperty('--glare-x', x);
        document.documentElement.style.setProperty('--glare-y', y);
      });
    };

    let orientRafId = null;
    const handleDeviceOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        if (orientRafId) cancelAnimationFrame(orientRafId);
        orientRafId = requestAnimationFrame(() => {
          // Normalize gamma (left/right tilt) and beta (front/back tilt)
          let x = e.gamma / 45; 
          let y = (e.beta - 45) / 45; // Assume 45deg is comfortable holding angle

          x = Math.max(-1, Math.min(1, x));
          y = Math.max(-1, Math.min(1, y));

          document.documentElement.style.setProperty('--glare-x', x);
          document.documentElement.style.setProperty('--glare-y', y);
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleDeviceOrientation, true);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <Hero />
            <Experience />
          </>
        );
      case 'projects':
        return <Projects />;
      case 'skills':
        return <Skills />;
      case 'contact':
        return <Contact />;
      default:
        return (
          <>
            <Hero />
            <Experience />
          </>
        );
    }
  };

  return (
    <>
      <CustomCursor />
      <LiquidBackground />
      <GlobalControls />
      <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
            {activeTab === 'contact' && <Footer />}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
