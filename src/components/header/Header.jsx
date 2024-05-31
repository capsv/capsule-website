import React from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';
import './Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Header() {
    const {isAuthenticated, logout} = useAuth();

    return (
        <header className="header">
            <Link to="/" className="header-logo">capsule</Link>
            <div className="header-buttons">
                {!isAuthenticated ? (
                    <>
                        <Link to="/auth/in" className="button-link">
                            <i className="fas fa-sign-in-alt"></i> sign in
                        </Link>
                        <Link to="/auth/up" className="button-link">
                            <i className="fas fa-user-plus"></i> sign up
                        </Link>
                    </>
                ) : (
                    <button className="button-link" onClick={logout}>
                        <i className="fas fa-sign-out-alt"></i> logout
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;