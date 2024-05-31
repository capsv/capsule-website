import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import './Footer.css';

function Footer() {
    const { toggleLanguage } = useLanguage();

    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2024 Your Company. All rights reserved.</p>
                <div className="language-switcher">
                    <button onClick={() => toggleLanguage('en')} className="language-button">
                        <img src="/flags/us.png" alt="English" />
                    </button>
                    <button onClick={() => toggleLanguage('ru')} className="language-button">
                        <img src="/flags/ru.png" alt="Русский" />
                    </button>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
