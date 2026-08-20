import React from 'react';
import styles from './ExperienceStyles.module.css';
import IDCard from './IDCard';

function Experience() {
  const experiences = [
    {
      role: 'Information Technology Intern',
      company: 'PT. Kimia Farma Apotek • Jakarta, Indonesia',
      date: 'November 2025 - May 2026',
      description: '• Validated inventory data across 51 regions (1,300+ outlets), ensuring accuracy for nationwide stock opname.\n• Automated data extraction with Python web scraping tools, reducing manual effort in inventory reconciliation.\n• Provided Head Office IT support for hardware, software, and networks, maintaining reliable daily operations.\n• Collaborated with cross-functional teams to resolve infrastructure issues, optimizing business processes.',
      techStack: ['Python', 'Web Scraping', 'Data Analysis', 'IT Support']
    },
    {
      role: 'Information Systems Intern',
      company: 'PT. Dirgantara Indonesia (Persero) • Bandung, Indonesia',
      date: 'November 2024 - January 2025',
      description: '• Managed 5,000+ data records for the Directorate of Technology and Development, ensuring accuracy across internal systems.\n• Developed an internal Company Profile web application using PHP and MySQL, improving user interfaces and system functionality.\n• Provided IT support by troubleshooting Windows systems and network connectivity, ensuring smooth daily operations.\n• Performed preventive maintenance and system monitoring for IT equipment, minimizing operational downtime.',
      techStack: ['PHP', 'MySQL', 'Data Management', 'IT Support']
    },
    {
      role: 'Bachelor of Informatics Engineering',
      company: 'University of Nurtanio',
      date: 'September 2021 - July 2025',
      description: '',
      techStack: []
    }
  ];

  return (
    <section id="experience" className={`glass-panel ${styles.container}`}>
      <div className={styles.contentWrapper}>
        <IDCard />
        <div className={styles.rightContent}>
          <h1 className="sectionTitle" style={{textAlign: 'left', marginBottom: '20px'}}>EXPERIENCES</h1>
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
