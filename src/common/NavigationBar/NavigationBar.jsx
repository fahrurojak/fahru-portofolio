import React from 'react';
import './NavigationBar.css';
import { MdHomeFilled, MdWork, MdCode, MdEmail } from 'react-icons/md';

const NavigationBar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', icon: <MdHomeFilled />, label: 'Home' },
    { id: 'projects', icon: <MdWork />, label: 'Projects' },
    { id: 'skills', icon: <MdCode />, label: 'Skills' },
    { id: 'contact', icon: <MdEmail />, label: 'Contact' }
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
