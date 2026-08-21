import styles from './ExperienceStyles.module.css';
import IDCard from './IDCard';
import { useLanguage } from '../../common/LanguageContext';

function Experience() {
  const { t } = useLanguage();
  const experiences = t('experience.roles');

  return (
    <section id="experience" className={`glass-panel ${styles.container}`}>
      <div className={styles.contentWrapper}>
        <IDCard />
        <div className={styles.rightContent}>
          <h1 className="sectionTitle" style={{textAlign: 'left', marginBottom: '20px'}}>{t('experience.title')}</h1>
          <div className={styles.experienceList}>
            {experiences.map((exp, index) => (
              <div key={index} className={styles.experienceItem}>
                <div className={styles.header}>
                  <div className={styles.roleInfo}>
                    <h3 className={styles.role}>{exp.role}</h3>
                    <span className={styles.company}>{exp.company}</span>
                  </div>
                  <span className={styles.date}>{exp.date}</span>
                </div>
                {exp.description && <p className={styles.description}>{exp.description}</p>}
                {exp.techStack.length > 0 && (
                  <div className={styles.techStack}>
                    {exp.techStack.map((tech, i) => (
                      <span key={i} className={styles.tech}>{tech}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Experience;
