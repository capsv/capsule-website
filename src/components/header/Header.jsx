import React from 'react';
import './Header.css';
import {Link} from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

function Header() {
    return (
        <header className="header">
            <Link to="/" className="header-logo">capsule</Link>
            <div className="header-buttons">
                <Link to="/auth/in" className="button-link">
                    <i className="fas fa-sign-in-alt"></i> Sign In
                </Link>
                <Link to="/auth/up" className="button-link">
                    <i className="fas fa-user-plus"></i> Sign Up
                </Link>
            </div>
        </header>
    );
}

export default Header;