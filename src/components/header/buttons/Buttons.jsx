import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import "./Buttons.css";

const Buttons = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();
    const currentPath = location.pathname;
    const isAccountPage = user ? currentPath === `/${user.username}` : false;
    const isSettingsPage = user ? currentPath === `/${user.username}/settings` : false;

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <div className="header-buttons">
            {isAuthenticated && user ? (
                <>
                    <div className="button-group">
                        <Link to={`/${user.username}`} className={`header-button account-button ${isAccountPage ? 'disabled' : ''}`} disabled={isAccountPage}>
                            Account
                        </Link>
                        <Link to={`/${user.username}/settings`} className={`header-button settings-button ${isSettingsPage ? 'disabled' : ''}`} disabled={isSettingsPage}>
                            Settings
                        </Link>
                        <button onClick={logout} className="header-button logout-button">Logout</button>
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
                                <Link to={`/${user.username}`} className={`dropdown-item ${isAccountPage ? 'disabled' : ''}`} onClick={toggleMenu}>Account</Link>
                                <Link to={`/${user.username}/settings`} className={`dropdown-item ${isSettingsPage ? 'disabled' : ''}`} onClick={toggleMenu}>Settings</Link>
                                <button onClick={() => { toggleMenu(); logout(); }} className="dropdown-item logout-item">Logout</button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <Link to="/auth/in" className="header-button login-button">Login</Link>
                    <Link to="/auth/up" className="header-button get-started-button">Get started</Link>
                </>
            )}
        </div>
    );
}

export default Buttons;
