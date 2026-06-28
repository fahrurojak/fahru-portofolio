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

function Skills() {
  return (
    <>
      <section id="skills" className={`glass-panel ${styles.container}`}>
        <h1 className="sectionTitle">Skills</h1>
        <div className={styles.skillList}>
          <SkillList src={htmlIcon} skill="HTML" />
          <SkillList src={cssIcon} skill="CSS" />
          <SkillList src={javasciptIcon} skill="JavaScript" />
        </div>
        <div className={styles.skillList}>
          <SkillList src={reactIcon} skill="React" />
          <SkillList src={phpIcon} skill="PHP" />
          <SkillList src={laravelIcon} skill="Laravel" />
        </div>
        <div className={styles.skillList}>
          <SkillList src={pythonIcon} skill="Phyton" />
          <SkillList src={sqlIcon} skill="SQL" />
          <SkillList src={excelIcon} skill="Excel" />
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
