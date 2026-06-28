import React, { useState, useEffect } from 'react';
import './App.css';
import Contact from './sections/Contact/Contact';
import Footer from './sections/Footer/Footer';
import Hero from './sections/Hero/Hero';
import Projects from './sections/Projects/Projects';
import Skills from './sections/Skills/Skills';
import NavigationBar from './common/NavigationBar/NavigationBar';
import LiquidBackground from './common/LiquidBackground/LiquidBackground';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      document.documentElement.style.setProperty('--glare-x', x);
      document.documentElement.style.setProperty('--glare-y', y);
    };

    const handleDeviceOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        // Normalize gamma (left/right tilt) and beta (front/back tilt)
        let x = e.gamma / 45; 
        let y = (e.beta - 45) / 45; // Assume 45deg is comfortable holding angle

        x = Math.max(-1, Math.min(1, x));
        y = Math.max(-1, Math.min(1, y));

        document.documentElement.style.setProperty('--glare-x', x);
        document.documentElement.style.setProperty('--glare-y', y);
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
        return <Hero />;
      case 'projects':
        return <Projects />;
      case 'skills':
        return <Skills />;
      case 'contact':
        return <Contact />;
      default:
        return <Hero />;
    }
  };

  return (
    <>
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
