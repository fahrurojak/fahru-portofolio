import './GlobalControls.css';
import { useTheme } from '../ThemeContext';
import { useLanguage } from '../LanguageContext';
import AccessibilityMenu from '../AccessibilityMenu/AccessibilityMenu';
import sun from '../../assets/sun.svg';
import moon from '../../assets/moon.svg';

function GlobalControls() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  
  const themeIcon = theme === 'light' ? sun : moon;

  return (
    <div className="global-controls">
      <AccessibilityMenu />
      
      {/* Modern Language Switch */}
      <div 
        className="modern-lang-switch" 
        onClick={toggleLanguage}
        role="button"
        tabIndex="0"
        onKeyDown={(e) => { if (e.key === 'Enter') toggleLanguage(); }}
        aria-label="Toggle Language"
      >
        <div className={`switch-slider ${language === 'en' ? 'right' : 'left'}`}></div>
        <span className={`switch-label ${language === 'id' ? 'active-text' : ''}`}>ID</span>
        <span className={`switch-label ${language === 'en' ? 'active-text' : ''}`}>EN</span>
      </div>

      {/* Dark Mode Toggle */}
      <div 
        className="theme-toggle-btn"
        onClick={toggleTheme}
        role="button"
        tabIndex="0"
        onKeyDown={(e) => { if (e.key === 'Enter') toggleTheme(); }}
        aria-label="Toggle Theme"
      >
        <img src={themeIcon} alt="Theme Icon" />
      </div>
    </div>
  );
}

export default GlobalControls;
