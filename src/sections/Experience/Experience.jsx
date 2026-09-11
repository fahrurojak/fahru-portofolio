import styles from './ExperienceStyles.module.css';
import IDCard from './IDCard';
import { useLanguage } from '../../common/LanguageContext';
import kimiaFarmaLogo from '../../assets/kimiafarma-apotek.png';
import ptdiLogo from '../../assets/ptdi-logo.png';
import unnurLogo from '../../assets/unnur-logo.gif';

const organizationLogos = {
  kimiaFarma: {
    src: kimiaFarmaLogo,
    alt: 'PT Kimia Farma Apotek',
    frameClass: styles.lightLogoFrame,
  },
  ptdi: {
    src: ptdiLogo,
    alt: 'PT Dirgantara Indonesia',
    frameClass: styles.lightLogoFrame,
  },
  unnur: {
    src: unnurLogo,
    alt: 'Universitas Nurtanio Bandung',
    frameClass: styles.lightLogoFrame,
  },
};

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
            {experiences.map((exp) => (
              <article key={exp.company} className={styles.experienceItem}>
                <div className={`${styles.logoFrame} ${organizationLogos[exp.logo].frameClass}`}>
                  <img
                    className={styles.organizationLogo}
                    src={organizationLogos[exp.logo].src}
                    alt={`${organizationLogos[exp.logo].alt} logo`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.header}>
                    <div className={styles.roleInfo}>
                      <span className={styles.category}>
                        {exp.kind === 'education'
                          ? t('experience.categories.education')
                          : t('experience.categories.work')}
                      </span>
                      <h3 className={styles.role}>{exp.role}</h3>
                      <span className={styles.company}>{exp.company}</span>
                      <span className={styles.date}>{exp.date}</span>
                    </div>
                  </div>
                  {exp.description && <p className={styles.description}>{exp.description}</p>}
                  {exp.techStack.length > 0 && (
                    <div className={styles.techStack}>
                      {exp.techStack.map((tech) => (
                        <span key={tech} className={styles.tech}>{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Experience;
