import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import './Footer.css';

function Footer() {

    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2024 capsule. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
