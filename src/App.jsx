import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './App.css';
import Contact from './sections/Contact/Contact';
import Footer from './sections/Footer/Footer';
import Hero from './sections/Hero/Hero';
import Projects from './sections/Projects/Projects';
import Skills from './sections/Skills/Skills';
import NavigationBar from './common/NavigationBar/NavigationBar';
import LiquidBackground from './common/LiquidBackground/LiquidBackground';
import Experience from './sections/Experience/Experience';

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 400, damping: 25 });

  useEffect(() => {
    // Ignore on touch devices to improve performance
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
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
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, scale]);

  return (
    <motion.div
      className="custom-cursor"
      style={{
        x: cursorX,
        y: cursorY,
        scale: springScale,
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
      <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        {renderContent()}
        {activeTab === 'contact' && <Footer />}
      </div>
    </>
  );
}

export default App;
