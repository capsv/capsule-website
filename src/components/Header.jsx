// src/components/Header.jsx
import React from 'react';
import './styles/Header.css';

function Header() {
    return (
        <header className="header-container">
            <div className="logo">Capsule</div>
            <nav className="nav">
                <button className="button">Sign In</button>
                <button className="button">Sign Up</button>
            </nav>
        </header>
    );
}

export default Header;

