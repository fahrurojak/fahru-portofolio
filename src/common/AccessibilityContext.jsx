import { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem('a11y-font-size') || '100');
  }); // percentage: 100, 110, 120

  const [grayscale, setGrayscale] = useState(() => {
    return localStorage.getItem('a11y-grayscale') === 'true';
  });

  const [dyslexiaFont, setDyslexiaFont] = useState(() => {
    return localStorage.getItem('a11y-dyslexia') === 'true';
  });

  const [highlightLinks, setHighlightLinks] = useState(() => {
    return localStorage.getItem('a11y-highlight-links') === 'true';
  });

  const [bigCursor, setBigCursor] = useState(() => {
    return localStorage.getItem('a11y-big-cursor') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('a11y-font-size', fontSize);
    localStorage.setItem('a11y-grayscale', grayscale);
    localStorage.setItem('a11y-dyslexia', dyslexiaFont);
    localStorage.setItem('a11y-highlight-links', highlightLinks);
    localStorage.setItem('a11y-big-cursor', bigCursor);

    // Apply classes to HTML tag
    const html = document.documentElement;

    // Font size
    html.style.setProperty('--a11y-font-size-multiplier', `${fontSize / 100}`);
    
    if (fontSize > 100) html.classList.add('a11y-large-text');
    else html.classList.remove('a11y-large-text');

    if (grayscale) html.classList.add('a11y-grayscale');
    else html.classList.remove('a11y-grayscale');

    if (dyslexiaFont) html.classList.add('a11y-dyslexia');
    else html.classList.remove('a11y-dyslexia');

    if (highlightLinks) html.classList.add('a11y-highlight-links');
    else html.classList.remove('a11y-highlight-links');

    if (bigCursor) html.classList.add('a11y-big-cursor');
    else html.classList.remove('a11y-big-cursor');
    
  }, [fontSize, grayscale, dyslexiaFont, highlightLinks, bigCursor]);

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 10, 140));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 10, 100));
  const resetFontSize = () => setFontSize(100);
  const toggleGrayscale = () => setGrayscale(prev => !prev);
  const toggleDyslexiaFont = () => setDyslexiaFont(prev => !prev);
  const toggleHighlightLinks = () => setHighlightLinks(prev => !prev);
  const toggleBigCursor = () => setBigCursor(prev => !prev);

  const resetAll = () => {
    setFontSize(100);
    setGrayscale(false);
    setDyslexiaFont(false);
    setHighlightLinks(false);
    setBigCursor(false);
  };

  return (
    <AccessibilityContext.Provider value={{
      fontSize, increaseFontSize, decreaseFontSize, resetFontSize,
      grayscale, toggleGrayscale,
      dyslexiaFont, toggleDyslexiaFont,
      highlightLinks, toggleHighlightLinks,
      bigCursor, toggleBigCursor,
      resetAll
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
