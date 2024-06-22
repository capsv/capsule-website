import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import "./Buttons.css";

const Buttons = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();
    const currentPath = location.pathname;
    const isAccountPage = user ? currentPath === `/${user.username}` : false;
    const isSettingsPage = user ? currentPath === `/${user.username}/settings` : false;

    return (
        <div className="header-buttons">
            {isAuthenticated && user ? (
                <>
                    <Link to={`/${user.username}`} className={`header-button account-button ${isAccountPage ? 'disabled' : ''}`} disabled={isAccountPage}>
                        Account
                    </Link>
                    <Link to={`/${user.username}/settings`} className={`header-button settings-button ${isSettingsPage ? 'disabled' : ''}`} disabled={isSettingsPage}>
                        Settings
                    </Link>
                    <button onClick={logout} className="header-button logout-button">Logout</button>
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