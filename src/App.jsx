import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './App.css';
import Footer from './sections/Footer/Footer';
import Hero from './sections/Hero/Hero';
import NavigationBar from './common/NavigationBar/NavigationBar';
import LiquidBackground from './common/LiquidBackground/LiquidBackground';
import Experience from './sections/Experience/Experience';

import CustomCursor from './common/CustomCursor';


const Contact = lazy(() => import('./sections/Contact/Contact'));
const Projects = lazy(() => import('./sections/Projects/Projects'));
const Skills = lazy(() => import('./sections/Skills/Skills'));

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const reducedMotion = useReducedMotion();

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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={reducedMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -15 }}
            transition={{
              duration: reducedMotion ? 0 : 0.28,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <Suspense fallback={<div className="section-loading" role="status">Loading...</div>}>{renderContent()}</Suspense>
            {activeTab === 'contact' && <Footer />}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
