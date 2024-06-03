import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import './UserSideMenu.css';

const UserSideMenu = ({ menuOpen, toggleMenu, menuRef }) => {
    const { isAuthenticated, logout, user } = useAuth();
    const { language } = useLanguage();

    const content = {
        en: {
            headerAuth: "Authorization",
            headerUser: "Menu",
            signin: "sign in",
            signup: "sign up",
            account: "Account",
            notifications: "Notifications",
            settings: "Settings",
            logout: "Logout"
        },
        ru: {
            headerAuth: "Авторизация",
            headerUser: "Меню",
            signin: "Вход",
            signup: "Регистрация",
            account: "Аккаунт",
            notifications: "Уведомления",
            settings: "Настройки",
            logout: "Выйти"
        }
    };

    return (
        <div ref={menuRef} className={`side-menu ${menuOpen ? 'open' : ''}`}>
            <div className="side-menu-content">
                <h1>{isAuthenticated ? content[language].headerUser : content[language].headerAuth}</h1>
                {isAuthenticated ? (
                    <>
                        <Link to={`/${user.username}`} className="side-menu-item" onClick={toggleMenu}>
                            <i className="fas fa-user"></i> {content[language].account}
                        </Link>
                        <Link to={`/${user.username}/notifications`} className="side-menu-item" onClick={toggleMenu}>
                            <i className="fas fa-bell"></i> {content[language].notifications}
                        </Link>
                        <Link to={`/${user.username}/settings`} className="side-menu-item" onClick={toggleMenu}>
                            <i className="fas fa-cog"></i> {content[language].settings}
                        </Link>
                        <Link to={`/`} className="side-menu-item" onClick={() => { logout(); toggleMenu(); }}>
                            <i className="fas fa-sign-out-alt"></i> {content[language].logout}
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/auth/in" className="side-menu-item" onClick={toggleMenu}>
                            <i className="fas fa-sign-in-alt"></i> {content[language].signin}
                        </Link>
                        <Link to="/auth/up" className="side-menu-item" onClick={toggleMenu}>
                            <i className="fas fa-user-plus"></i> {content[language].signup}
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserSideMenu;
