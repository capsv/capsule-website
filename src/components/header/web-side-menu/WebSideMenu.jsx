import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import './WebSideMenu.css';

const WebSideMenu = ({ menuOpen, toggleMenu, menuRef }) => {
    const { language } = useLanguage();

    const content = {
        en: {
            header: "Site",
            blog: "Blog"
        },
        ru: {
            header: "Сайт",
            blog: "Блог"
        }
    };

    return (
        <div ref={menuRef} className={`side-menu ${menuOpen ? 'open' : ''}`}>
            <div className="side-menu-content">
                <h1>{content[language].header}</h1>
                <Link to="/blog" className="side-menu-item" onClick={toggleMenu}>
                    <i className="fas fa-blog"></i> {content[language].blog}
                </Link>
            </div>
        </div>
    );
};

export default WebSideMenu;
