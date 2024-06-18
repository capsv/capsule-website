import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Buttons from "./buttons/Buttons.jsx";

function Header() {

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo">
                    <span className="header-logo-text">capsule</span>
                </Link>
                <Buttons/>
            </div>
        </header>
    );
}

export default Header;
