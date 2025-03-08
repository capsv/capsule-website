import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useLanguage } from "../../../context/LanguageContext.jsx";
import { translations } from "../../../translations/index.js";
import "./Buttons.css";

const Buttons = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();
    const { language, toggleLanguage } = useLanguage();
    const currentPath = location.pathname;
    const dropdownRef = useRef(null);
    const guestDropdownRef = useRef(null);
    
    const isAccountPage = user ? currentPath === `/${user.username}` : false;
    const isSettingsPage = user ? currentPath === `/${user.username}/settings` : false;
    const isHomePage = currentPath === '/';
    const isLoginPage = currentPath === '/auth/in';
    const isSignupPage = currentPath === '/auth/up';

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isGuestMenuOpen, setIsGuestMenuOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState('');

    // Обработчик клика вне меню для его закрытия
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target)) {
                setIsGuestMenuOpen(false);
            }
        };

        if (isMenuOpen || isGuestMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen, isGuestMenuOpen]);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prevState => !prevState);
    }, []);
    
    const toggleGuestMenu = useCallback(() => {
        setIsGuestMenuOpen(prevState => !prevState);
    }, []);

    const toggleLanguageButton = useCallback(() => {
        const newLanguage = language === 'en' ? 'ru' : 'en';
        toggleLanguage(newLanguage);
    }, [language, toggleLanguage]);
    
    const handleLogout = useCallback(() => {
        if (isMenuOpen) {
            toggleMenu();
        }
        logout();
    }, [isMenuOpen, toggleMenu, logout]);

    const handleTooltip = (tooltipName) => {
        setShowTooltip(tooltipName);
    };

    const t = translations.header[language];

    return (
        <nav className="header-buttons" aria-label="Main navigation">
            <button 
                onClick={toggleLanguageButton} 
                className="header-button language-button" 
                aria-label={`Change language to ${language === 'en' ? 'Russian' : 'English'}`}
                onMouseEnter={() => handleTooltip('language')}
                onMouseLeave={() => handleTooltip('')}
            >
                <span className="button-icon">
                    <i className="fas fa-globe"></i>
                </span>
                <span className="button-text">{language === 'en' ? 'RU' : 'EN'}</span>
                {showTooltip === 'language' && (
                    <div className="tooltip">{language === 'en' ? 'Русский язык' : 'English language'}</div>
                )}
            </button>

            {isAuthenticated && user ? (
                <>
                    <div className="button-group">
                        <Link 
                            to={`/${user.username}`} 
                            className={`header-button account-button ${isAccountPage ? 'active' : ''}`}
                            onMouseEnter={() => handleTooltip('account')}
                            onMouseLeave={() => handleTooltip('')}
                        >
                            <span className="button-icon">
                                <i className="fas fa-user"></i>
                            </span>
                            <span className="button-text">{t.account}</span>
                            {showTooltip === 'account' && (
                                <div className="tooltip">{t.viewProfile}</div>
                            )}
                        </Link>
                        <Link 
                            to={`/${user.username}/settings`} 
                            className={`header-button settings-button ${isSettingsPage ? 'active' : ''}`}
                            onMouseEnter={() => handleTooltip('settings')}
                            onMouseLeave={() => handleTooltip('')}
                        >
                            <span className="button-icon">
                                <i className="fas fa-cog"></i>
                            </span>
                            <span className="button-text">{t.settings}</span>
                            {showTooltip === 'settings' && (
                                <div className="tooltip">{t.manageSettings}</div>
                            )}
                        </Link>
                        <button 
                            onClick={logout} 
                            className="header-button logout-button"
                            onMouseEnter={() => handleTooltip('logout')}
                            onMouseLeave={() => handleTooltip('')}
                        >
                            <span className="button-icon">
                                <i className="fas fa-sign-out-alt"></i>
                            </span>
                            <span className="button-text">{t.logout}</span>
                            {showTooltip === 'logout' && (
                                <div className="tooltip">{t.signOut}</div>
                            )}
                        </button>
                    </div>
                    <div className="menu-button-container" ref={dropdownRef}>
                        <button 
                            onClick={toggleMenu} 
                            className={`header-button menu-button ${isMenuOpen ? 'open' : ''}`}
                            aria-expanded={isMenuOpen}
                            aria-label="Menu"
                        >
                            <div className="menu-icon">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </button>
                        {isMenuOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-header">
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt="" />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="user-details">
                                            <span className="username">{user.username}</span>
                                            <span className="email">{user.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <Link 
                                    to={`/${user.username}`} 
                                    className={`dropdown-item ${isAccountPage ? 'active' : ''}`} 
                                    onClick={toggleMenu}
                                >
                                    <i className="fas fa-user item-icon"></i>
                                    {t.account}
                                </Link>
                                <Link 
                                    to={`/${user.username}/settings`} 
                                    className={`dropdown-item ${isSettingsPage ? 'active' : ''}`} 
                                    onClick={toggleMenu}
                                >
                                    <i className="fas fa-cog item-icon"></i>
                                    {t.settings}
                                </Link>
                                <div className="dropdown-divider"></div>
                                <button onClick={handleLogout} className="dropdown-item logout-item">
                                    <i className="fas fa-sign-out-alt item-icon"></i>
                                    {t.logout}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    {/* Кнопки для десктопа для неавторизованных пользователей */}
                    <div className="guest-buttons">
                        <Link 
                            to="/" 
                            className={`header-button home-button ${isHomePage ? 'active' : ''}`}
                            onMouseEnter={() => handleTooltip('home')}
                            onMouseLeave={() => handleTooltip('')}
                        >
                            <span className="button-icon">
                                <i className="fas fa-home"></i>
                            </span>
                            <span className="button-text">{t.home}</span>
                            {showTooltip === 'home' && (
                                <div className="tooltip">{t.homePage}</div>
                            )}
                        </Link>
                        <Link 
                            to="/auth/in" 
                            className="header-button login-button"
                            onMouseEnter={() => handleTooltip('login')}
                            onMouseLeave={() => handleTooltip('')}
                        >
                            <span className="button-icon">
                                <i className="fas fa-sign-in-alt"></i>
                            </span>
                            <span className="button-text">{t.login}</span>
                            {showTooltip === 'login' && (
                                <div className="tooltip">{t.signIn}</div>
                            )}
                        </Link>
                        <Link 
                            to="/auth/up" 
                            className="header-button get-started-button"
                            onMouseEnter={() => handleTooltip('signup')}
                            onMouseLeave={() => handleTooltip('')}
                        >
                            <span className="button-icon">
                                <i className="fas fa-user-plus"></i>
                            </span>
                            <span className="button-text">{t.getStarted}</span>
                            {showTooltip === 'signup' && (
                                <div className="tooltip">{t.register}</div>
                            )}
                        </Link>
                    </div>
                    
                    {/* Мобильное меню для неавторизованных пользователей */}
                    <div className="menu-button-container guest-menu-button-container" ref={guestDropdownRef}>
                        <button 
                            onClick={toggleGuestMenu} 
                            className={`header-button menu-button ${isGuestMenuOpen ? 'open' : ''}`}
                            aria-expanded={isGuestMenuOpen}
                            aria-label="Menu"
                        >
                            <div className="menu-icon">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </button>
                        {isGuestMenuOpen && (
                            <div className="dropdown-menu guest-dropdown-menu">
                                <div className="dropdown-header">
                                    <h3 className="auth-menu-title">{t.navigation}</h3>
                                </div>
                                <div className="dropdown-divider"></div>
                                <Link 
                                    to="/" 
                                    className={`dropdown-item ${isHomePage ? 'active' : ''}`} 
                                    onClick={toggleGuestMenu}
                                >
                                    <i className="fas fa-home item-icon"></i>
                                    {t.home}
                                </Link>
                                <div className="dropdown-divider"></div>
                                <Link 
                                    to="/auth/in" 
                                    className={`dropdown-item ${isLoginPage ? 'active' : ''}`} 
                                    onClick={toggleGuestMenu}
                                >
                                    <i className="fas fa-sign-in-alt item-icon"></i>
                                    {t.login}
                                </Link>
                                <Link 
                                    to="/auth/up" 
                                    className={`dropdown-item ${isSignupPage ? 'active' : ''}`} 
                                    onClick={toggleGuestMenu}
                                >
                                    <i className="fas fa-user-plus item-icon"></i>
                                    {t.getStarted}
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </nav>
    );
}

export default Buttons;
