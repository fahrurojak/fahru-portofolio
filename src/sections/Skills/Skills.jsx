import styles from './SkillsStyles.module.css';
import htmlIcon from '../../assets/html.svg'
import cssIcon from '../../assets/css.svg'
import javasciptIcon from '../../assets/javascript.svg'
import reactIcon from '../../assets/react-js.svg'
import phpIcon from '../../assets/php.svg'
import laravelIcon from '../../assets/laravel.svg'
import pythonIcon from '../../assets/python.svg'
import sqlIcon from '../../assets/sql.svg'
import excelIcon from '../../assets/excel.svg'
import SkillList from '../../common/SkillList';
import Certificates from '../Certificates/Certificates';
import { useRef } from 'react';
import { useLanguage } from '../../common/LanguageContext';

function Skills() {
  const containerRef = useRef(null);
  const { t } = useLanguage();

  return (
    <>
      <section id="skills" className={`glass-panel ${styles.container}`} ref={containerRef}>
        <h1 className="sectionTitle">{t('skills.title')}</h1>
        
        <div className={styles.skillList}>
          <SkillList src={htmlIcon} skill="HTML" dragConstraints={containerRef} />
          <SkillList src={cssIcon} skill="CSS" dragConstraints={containerRef} />
          <SkillList src={javasciptIcon} skill="JavaScript" dragConstraints={containerRef} />
        </div>
        <div className={styles.skillList}>
          <SkillList src={reactIcon} skill="React" dragConstraints={containerRef} />
          <SkillList src={phpIcon} skill="PHP" dragConstraints={containerRef} />
          <SkillList src={laravelIcon} skill="Laravel" dragConstraints={containerRef} />
        </div>
        <div className={styles.skillList}>
          <SkillList src={pythonIcon} skill="Python" dragConstraints={containerRef} />
          <SkillList src={sqlIcon} skill="SQL" dragConstraints={containerRef} />
          <SkillList src={excelIcon} skill="Excel" dragConstraints={containerRef} />
        </div>
        
      </section>
      <div style={{height: '20px'}}></div>
      <section className={`glass-panel ${styles.container}`}>
        <Certificates />
      </section>
    </>
  );
}

export default Skills;
