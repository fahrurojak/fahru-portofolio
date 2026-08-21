import { useState, useRef, useEffect } from 'react';
import './AccessibilityMenu.css';
import { useAccessibility } from '../AccessibilityContext';
import { useLanguage } from '../LanguageContext';
import { MdAccessibilityNew, MdClose, MdZoomIn, MdZoomOut, MdFormatColorReset, MdFontDownload, MdLink, MdTouchApp, MdRefresh } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';

function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    fontSize, increaseFontSize, decreaseFontSize, resetFontSize,
    grayscale, toggleGrayscale,
    dyslexiaFont, toggleDyslexiaFont,
    highlightLinks, toggleHighlightLinks,
    bigCursor, toggleBigCursor,
    resetAll
  } = useAccessibility();
  const { language } = useLanguage();
  const menuRef = useRef(null);

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isEn = language === 'en';

  return (
    <div className="a11y-widget" ref={menuRef}>
      <button 
        className={`a11y-fab ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility Menu"
        title={isEn ? "Accessibility Menu" : "Menu Aksesibilitas"}
      >
        {isOpen ? <MdClose size={20} /> : <MdAccessibilityNew size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="a11y-panel glass-panel"
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="a11y-header">
              <h3>{isEn ? "Accessibility Tools" : "Alat Aksesibilitas"}</h3>
              <button className="a11y-reset-btn" onClick={resetAll} title={isEn ? "Reset All" : "Atur Ulang Semua"}>
                <MdRefresh size={18} /> {isEn ? "Reset" : "Reset"}
              </button>
            </div>

            <div className="a11y-content">
              {/* Text Size */}
              <div className="a11y-item">
                <div className="a11y-item-info">
                  <span className="a11y-icon"><MdZoomIn /></span>
                  <span>{isEn ? "Text Size" : "Ukuran Teks"} ({fontSize}%)</span>
                </div>
                <div className="a11y-font-controls">
                  <button onClick={decreaseFontSize} disabled={fontSize <= 100}><MdZoomOut /></button>
                  <button onClick={increaseFontSize} disabled={fontSize >= 140}><MdZoomIn /></button>
                </div>
              </div>

              {/* Grayscale */}
              <div className="a11y-item" onClick={toggleGrayscale}>
                <div className="a11y-item-info">
                  <span className="a11y-icon"><MdFormatColorReset /></span>
                  <span>{isEn ? "Grayscale" : "Mode Hitam Putih"}</span>
                </div>
                <div className={`a11y-switch ${grayscale ? 'on' : 'off'}`}>
                  <div className="a11y-thumb"></div>
                </div>
              </div>

              {/* Dyslexia Font */}
              <div className="a11y-item" onClick={toggleDyslexiaFont}>
                <div className="a11y-item-info">
                  <span className="a11y-icon"><MdFontDownload /></span>
                  <span>{isEn ? "Dyslexia Friendly" : "Font Disleksia"}</span>
                </div>
                <div className={`a11y-switch ${dyslexiaFont ? 'on' : 'off'}`}>
                  <div className="a11y-thumb"></div>
                </div>
              </div>

              {/* Highlight Links */}
              <div className="a11y-item" onClick={toggleHighlightLinks}>
                <div className="a11y-item-info">
                  <span className="a11y-icon"><MdLink /></span>
                  <span>{isEn ? "Highlight Links" : "Sorot Tautan"}</span>
                </div>
                <div className={`a11y-switch ${highlightLinks ? 'on' : 'off'}`}>
                  <div className="a11y-thumb"></div>
                </div>
              </div>

              {/* Big Cursor */}
              <div className="a11y-item" onClick={toggleBigCursor}>
                <div className="a11y-item-info">
                  <span className="a11y-icon"><MdTouchApp /></span>
                  <span>{isEn ? "Big Cursor" : "Kursor Besar"}</span>
                </div>
                <div className={`a11y-switch ${bigCursor ? 'on' : 'off'}`}>
                  <div className="a11y-thumb"></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AccessibilityMenu;
