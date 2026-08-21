import styles from './FooterStyles.module.css';
import { useLanguage } from '../../common/LanguageContext';

function Footer() {
  const { t } = useLanguage();

  return (
    <section id="footer" className={styles.container}>
      <p>
        &copy; 2026 Fahru Rojak. <br />
        {t('footer.rights')}
      </p>
    </section>
  );
}

export default Footer;
