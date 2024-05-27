import { useState, useEffect } from 'react';
import styles from './HeroStyles.module.css';
import heroImg from '../../assets/fahru.png';
import sun from '../../assets/sun.svg';
import moon from '../../assets/moon.svg';
import instagramLight from '../../assets/instagram-light.svg';
import instagramDark from '../../assets/instagram-dark.svg';
import githubLight from '../../assets/github-light.svg';
import githubDark from '../../assets/github-dark.svg';
import linkedinLight from '../../assets/linkedin-light.svg';
import linkedinDark from '../../assets/linkedin-dark.svg';
import CV from '../../assets/cv.pdf';
import { useTheme } from '../../common/ThemeContext';

function Hero() {
  const { theme, toggleTheme } = useTheme();

  const themeIcon = theme === 'light' ? sun : moon;
  const instagramIcon = theme === 'light' ? instagramLight : instagramDark;
  const githubIcon = theme === 'light' ? githubLight : githubDark;
  const linkedinIcon = theme === 'light' ? linkedinLight : linkedinDark;

  const [displayedText, setDisplayedText] = useState('');
  const fullText = "Passionate about frontend development and data analytics, I excel at creating visually appealing, user-friendly interfaces and leveraging data to enhance user experiences.";

  const [flipText, setFlipText] = useState('Frontend Developer');
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayedText(fullText.slice(0, index));
      index += 1;
      if (index > fullText.length) {
        clearInterval(timer);
      }
    }, 50); // Adjust typing speed here
    return () => clearInterval(timer);
  }, [fullText]);

  useEffect(() => {
    const flipInterval = setInterval(() => {
      setAnimationClass(styles.flipOut);
      setTimeout(() => {
        setFlipText(prev => (prev === 'Frontend Developer' ? 'Data Enthusiast' : 'Frontend Developer'));
        setAnimationClass(styles.flipIn);
      }, 500); // Duration of flip-out effect
    }, 3000); // Change every 3 seconds
    return () => clearInterval(flipInterval);
  }, []);

  return (
    <section id="hero" className={styles.container}>
      <div className={styles.colorModeContainer}>
        <img
          src={heroImg}
          className={styles.hero}
          alt="Photo Fahru"
        />
        <img
          className={styles.colorMode}
          src={themeIcon}
          alt="Color mode icon"
          onClick={toggleTheme}
        />
      </div>
      <div className={styles.info}>
        <h1>
          Fahru
          <br />
          Rojak
        </h1>
        <h2 className={`${styles.flipText} ${animationClass}`}>{flipText}</h2>
        <span>
          <a href="https://instagram.com/fahruphoto" target="_blank" rel="noopener noreferrer">
            <img src={instagramIcon} alt="Instagram icon" />
          </a>
          <a href="https://github.com/fahrurojak" target="_blank" rel="noopener noreferrer">
            <img src={githubIcon} alt="Github icon" />
          </a>
          <a href="https://linkedin.com/fahrurojak" target="_blank" rel="noopener noreferrer">
            <img src={linkedinIcon} alt="Linkedin icon" />
          </a>
        </span>
        <p className={`${styles.description} ${styles.typewriter}`}>{displayedText}</p>
        <a href={CV} download>
          <button className="hover">Resume</button>
        </a>
      </div>
    </section>
  );
}

export default Hero;
