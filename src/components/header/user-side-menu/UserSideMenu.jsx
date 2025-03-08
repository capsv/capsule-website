import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import './UserSideMenu.css';

const UserSideMenu = ({ menuOpen, toggleMenu, menuRef }) => {
    const { isAuthenticated, logout, user } = useAuth();
    const { language } = useLanguage();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState('');

    // Определяем активный пункт меню на основе текущего URL
    useEffect(() => {
        if (isAuthenticated && user) {
            if (location.pathname === `/${user.username}`) {
                setActiveItem('account');
            } else if (location.pathname === `/${user.username}/notifications`) {
                setActiveItem('notifications');
            } else if (location.pathname === `/${user.username}/settings`) {
                setActiveItem('settings');
            } else {
                setActiveItem('');
            }
        } else if (location.pathname === '/auth/in') {
            setActiveItem('signin');
        } else if (location.pathname === '/auth/up') {
            setActiveItem('signup');
        } else {
            setActiveItem('');
        }
    }, [location, isAuthenticated, user]);

    const content = {
        en: {
            headerAuth: "Authorization",
            headerUser: "Menu",
            signin: "Sign in",
            signup: "Sign up",
            account: "Account",
            notifications: "Notifications",
            settings: "Settings",
            logout: "Logout",
            accountGroup: "Profile",
            actionsGroup: "Actions"
        },
        ru: {
            headerAuth: "Авторизация",
            headerUser: "Меню",
            signin: "Вход",
            signup: "Регистрация",
            account: "Аккаунт",
            notifications: "Уведомления",
            settings: "Настройки",
            logout: "Выйти",
            accountGroup: "Профиль",
            actionsGroup: "Действия"
        }
    };

    const handleItemClick = (action) => {
        if (action === 'logout') {
            logout();
        }
        toggleMenu();
    };

    return (
        <>
            {/* Затемнение заднего фона при открытом меню */}
            {menuOpen && <div className="side-menu-backdrop" onClick={toggleMenu}></div>}
            
            <div ref={menuRef} className={`side-menu ${menuOpen ? 'open' : ''}`}>
                <div className="side-menu-content">
                    <div className="side-menu-header">
                        <h1>{isAuthenticated ? content[language].headerUser : content[language].headerAuth}</h1>
                        <button className="close-menu-button" onClick={toggleMenu}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    
                    {isAuthenticated && user && (
                        <div className="user-profile-section">
                            <div className="user-avatar">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.username} />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="user-info">
                                <h3>{user.username}</h3>
                                <span>{user.email}</span>
                            </div>
                        </div>
                    )}
                    
                    <div className="menu-items-container">
                        {isAuthenticated ? (
                            <>
                                <div className="menu-group">
                                    <h4 className="menu-group-title">{content[language].accountGroup}</h4>
                                    <Link 
                                        to={`/${user.username}`} 
                                        className={`side-menu-item ${activeItem === 'account' ? 'active' : ''}`} 
                                        onClick={() => handleItemClick('account')}
                                    >
                                        <i className="fas fa-user"></i> 
                                        <span>{content[language].account}</span>
                                    </Link>
                                    <Link 
                                        to={`/${user.username}/notifications`} 
                                        className={`side-menu-item ${activeItem === 'notifications' ? 'active' : ''}`} 
                                        onClick={() => handleItemClick('notifications')}
                                    >
                                        <i className="fas fa-bell"></i> 
                                        <span>{content[language].notifications}</span>
                                    </Link>
                                    <Link 
                                        to={`/${user.username}/settings`} 
                                        className={`side-menu-item ${activeItem === 'settings' ? 'active' : ''}`} 
                                        onClick={() => handleItemClick('settings')}
                                    >
                                        <i className="fas fa-cog"></i> 
                                        <span>{content[language].settings}</span>
                                    </Link>
                                </div>
                                
                                <div className="menu-group">
                                    <h4 className="menu-group-title">{content[language].actionsGroup}</h4>
                                    <Link 
                                        to="/" 
                                        className="side-menu-item logout-item" 
                                        onClick={() => handleItemClick('logout')}
                                    >
                                        <i className="fas fa-sign-out-alt"></i> 
                                        <span>{content[language].logout}</span>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="menu-group">
                                <Link 
                                    to="/auth/in" 
                                    className={`side-menu-item ${activeItem === 'signin' ? 'active' : ''}`} 
                                    onClick={() => handleItemClick('signin')}
                                >
                                    <i className="fas fa-sign-in-alt"></i> 
                                    <span>{content[language].signin}</span>
                                </Link>
                                <Link 
                                    to="/auth/up" 
                                    className={`side-menu-item ${activeItem === 'signup' ? 'active' : ''}`} 
                                    onClick={() => handleItemClick('signup')}
                                >
                                    <i className="fas fa-user-plus"></i> 
                                    <span>{content[language].signup}</span>
                                </Link>
                            </div>
                        )}
                    </div>
                    
                    <div className="side-menu-footer">
                        <div className="language-switcher">
                            <button className={`language-button ${language === 'ru' ? 'active' : ''}`} onClick={() => toggleMenu()}>
                                CAPSULE © {new Date().getFullYear()}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserSideMenu;
