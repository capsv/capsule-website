import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import "./Buttons.css";

const Buttons = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <div className="header-buttons">
            {isAuthenticated ? (
                <button onClick={logout} className="header-button logout-button">Logout</button>
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
