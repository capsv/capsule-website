import React from 'react';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-logo">capsule</div>
            <div className="header-buttons">
                <button className="button">sign in</button>
                <button className="button">sign up</button>
            </div>
        </header>
    );
}

export default Header;