import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Header() {
    const { isAuthenticated, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="header">
            <Link to="/" className="header-logo">capsule</Link>
            <div className="header-buttons">
                {!isAuthenticated ? (
                    <>
                        <div className="icon-button" onClick={toggleMenu}>
                            <i className="fas fa-user"></i>
                        </div>
                        <div className="icon-button">
                            <i className="fas fa-bars"></i>
                        </div>
                    </>
                ) : (
                    <button className="button-link" onClick={logout}>
                        <i className="fas fa-sign-out-alt"></i> logout
                    </button>
                )}
            </div>
            <div ref={menuRef} className={`side-menu ${menuOpen ? 'open' : ''}`}>
                <div className="side-menu-content">
                    <Link to="/auth/in" className="side-menu-item" onClick={toggleMenu}>
                        <i className="fas fa-sign-in-alt"></i> sign in
                    </Link>
                    <Link to="/auth/up" className="side-menu-item" onClick={toggleMenu}>
                        <i className="fas fa-user-plus"></i> sign up
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
