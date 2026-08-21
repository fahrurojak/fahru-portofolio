import './NavigationBar.css';
import { MdHomeFilled, MdWork, MdCode, MdEmail } from 'react-icons/md';
import { useLanguage } from '../LanguageContext';

const NavigationBar = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', icon: <MdHomeFilled />, label: t('nav.home') },
    { id: 'projects', icon: <MdWork />, label: t('nav.projects') },
    { id: 'skills', icon: <MdCode />, label: t('nav.skills') },
    { id: 'contact', icon: <MdEmail />, label: t('nav.contact') }
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          <div className="icon-container">{item.icon}</div>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default NavigationBar;
