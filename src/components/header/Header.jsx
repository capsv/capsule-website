import React from 'react';
import './Header.css';
import {Link} from "react-router-dom";

function Header() {
    return (
        <header className="header">
            <div className="header-logo">capsule</div>
            <div className="header-buttons">
                <Link to="/signin" className="button-link">Sign In</Link>
                <Link to="/signup" className="button-link">Sign Up</Link>
            </div>
        </header>
    );
}

export default Header;