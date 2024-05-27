import React from 'react';
import './Header.css';
import {Link} from "react-router-dom";

function Header() {
    return (
        <header className="header">
            <div className="header-logo">capsule</div>
            <div className="header-buttons">
                <Link to="/auth/in" className="button-link">sign in</Link>
                <Link to="/auth/up" className="button-link">sign up</Link>
            </div>
        </header>
    );
}

export default Header;