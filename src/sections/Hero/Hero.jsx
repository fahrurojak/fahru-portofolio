import { useState, useEffect } from 'react';
import styles from './HeroStyles.module.css';
import heroImg from '../../assets/fahru.png';
import sun from '../../assets/sun.svg';
import moon from '../../assets/moon.svg';
import twitterLight from '../../assets/instagram-light.svg';
import twitterDark from '../../assets/instagram-dark.svg';
import githubLight from '../../assets/github-light.svg';
import githubDark from '../../assets/github-dark.svg';
import linkedinLight from '../../assets/linkedin-light.svg';
import linkedinDark from '../../assets/linkedin-dark.svg';
import CV from '../../assets/cv.pdf';
import { useTheme } from '../../common/ThemeContext';

function Hero() {
  const { theme, toggleTheme } = useTheme();

  const themeIcon = theme === 'light' ? sun : moon;
  const twitterIcon = theme === 'light' ? twitterLight : twitterDark;
  const githubIcon = theme === 'light' ? githubLight : githubDark;
  const linkedinIcon = theme === 'light' ? linkedinLight : linkedinDark;

  const fullText = "Passionate about IT operations, technical support, and web development, I excel at ensuring reliable system performance, troubleshooting complex issues, and creating user-friendly web applications.";

  return (
    <section id="hero" className={`glass-panel ${styles.container}`}>
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
        <h2>IT Operations | IT Support | Web Developer</h2>
        <span>
          <a href="https://instagram.com/fahruphoto/" target="_blank" rel="noopener noreferrer">
            <img src={twitterIcon} alt="Instagram icon" />
          </a>
          <a href="https://github.com/fahrurojak/" target="_blank" rel="noopener noreferrer">
            <img src={githubIcon} alt="Github icon" />
          </a>
          <a href="https://linkedin.com/in/fahrurojak/" target="_blank" rel="noopener noreferrer">
            <img src={linkedinIcon} alt="Linkedin icon" />
          </a>
        </span>
        <p className={`${styles.description} ${styles.fadeIn}`}>
          {fullText}
        </p>
        <a href={CV} download>
          <button className="hover">Resume</button>
        </a>
      </div>
    </section>
  );
}

export default Hero;
