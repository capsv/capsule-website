import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <div className="language-switcher">
            <button 
                className={`language-btn ${language === 'ru' ? 'active' : ''}`} 
                onClick={() => toggleLanguage('ru')}
            >
                RU
            </button>
            <button 
                className={`language-btn ${language === 'en' ? 'active' : ''}`} 
                onClick={() => toggleLanguage('en')}
            >
                EN
            </button>
        </div>
    );
};

export default LanguageSwitcher; 