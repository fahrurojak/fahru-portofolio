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

function Skills() {
  return (
    <section id="skills" className={styles.container}>
      <h1 className="sectionTitle">Skills</h1>
      <div className={styles.skillList}>
        <SkillList src={htmlIcon} skill="HTML" />
        <SkillList src={cssIcon} skill="CSS" />
        <SkillList src={javasciptIcon} skill="JavaScript" />
      </div>
      <hr />
      <div className={styles.skillList}>
        <SkillList src={reactIcon} skill="React" />
        <SkillList src={phpIcon} skill="PHP" />
        <SkillList src={laravelIcon} skill="Laravel" />
      </div>
      <hr />
      <div className={styles.skillList}>
        <SkillList src={pythonIcon} skill="Phyton" />
        <SkillList src={sqlIcon} skill="SQL" />
        <SkillList src={excelIcon} skill="Excel" />
      </div>
    </section>
  );
}

export default Skills;
