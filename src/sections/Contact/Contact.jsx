import styles from './ContactStyles.module.css';
import { useLanguage } from '../../common/LanguageContext';

function Contact() {
  const { t } = useLanguage();
  
  return (
    <section id="contact" className={`glass-panel ${styles.container}`}>
      <h1 className="sectionTitle">{t('contact.title')}</h1>
      <form action="https://formsubmit.co/fahruojak@gmail.com" method="POST">
        <div className="formGroup">
          <input
            type="text"
            name="name"
            id="name"
            placeholder={t('contact.name')}
            aria-label={t('contact.name')}
            required
          />
        </div>
        <div className="formGroup">
          <input
            type="email"
            name="email"
            id="email"
            placeholder={t('contact.email')}
            aria-label={t('contact.email')}
            required
          />
        </div>
        <div className="formGroup">
          <input
            type="text"
            name="_subject"
            id="subject"
            placeholder={t('contact.subject')}
            aria-label={t('contact.subject')}
            required
          />
        </div>
        <div className="formGroup">
          <textarea
            name="message"
            id="message"
            placeholder={t('contact.message')}
            aria-label={t('contact.message')}
            required></textarea>
        </div>
        <input className="hover btn" type="submit" value={t('contact.submit')} />
      </form>
    </section>
  );
}

export default Contact;
