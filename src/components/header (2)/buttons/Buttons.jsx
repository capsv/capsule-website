import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import "./Buttons.css";
import {useLanguage} from "../../../context/LanguageContext.jsx";

const translations = {
    en: {
        account: 'Account',
        settings: 'Settings',
        logout: 'Logout',
        login: 'Login',
        getStarted: 'Get started'
    },
    ru: {
        account: 'Аккаунт',
        settings: 'Настройки',
        logout: 'Выйти',
        login: 'Войти',
        getStarted: 'Начать'
    }
};

const Buttons = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();
    const { toggleLanguage } = useLanguage();
    const currentPath = location.pathname;
    const isAccountPage = user ? currentPath === `/${user.username}` : false;
    const isSettingsPage = user ? currentPath === `/${user.username}/settings` : false;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'en';
    });

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleLanguageButton = () => {
        const newLanguage = language === 'en' ? 'ru' : 'en';
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
        toggleLanguage(newLanguage);
    };

    useEffect(() => {
        document.documentElement.lang = language; // Устанавливаем атрибут lang для html элемента
    }, [language]);

    return (
        <div className="header-buttons">
            <button onClick={toggleLanguageButton} className="header-button language-button">
                {language === 'en' ? 'RU' : 'EN'}
            </button>
            {isAuthenticated && user ? (
                <>
                    <div className="button-group">
                        <Link to={`/${user.username}`} className={`header-button account-button ${isAccountPage ? 'active' : ''}`}>
                            {translations[language].account}
                        </Link>
                        <Link to={`/${user.username}/settings`} className={`header-button settings-button ${isSettingsPage ? 'active' : ''}`}>
                            {translations[language].settings}
                        </Link>
                        <button onClick={logout} className="header-button logout-button">
                            {translations[language].logout}
                        </button>
                    </div>
                    <div className="menu-button-container">
                        <button onClick={toggleMenu} className={`header-button menu-button ${isMenuOpen ? 'open' : ''}`}>
                            <div className="menu-icon">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </button>
                        {isMenuOpen && (
                            <div className="dropdown-menu">
                                <Link to={`/${user.username}`} className={`dropdown-item ${isAccountPage ? 'active' : ''}`} onClick={toggleMenu}>
                                    {translations[language].account}
                                </Link>
                                <Link to={`/${user.username}/settings`} className={`dropdown-item ${isSettingsPage ? 'active' : ''}`} onClick={toggleMenu}>
                                    {translations[language].settings}
                                </Link>
                                <button onClick={() => { toggleMenu(); logout(); }} className="dropdown-item logout-item">
                                    {translations[language].logout}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <Link to="/auth/in" className="header-button login-button">
                        {translations[language].login}
                    </Link>
                    <Link to="/auth/up" className="header-button get-started-button">
                        {translations[language].getStarted}
                    </Link>
                </>
            )}
        </div>
    );
}

export default Buttons;
