import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import HeaderMenus from './header-menus/HeaderMenus.jsx';
import UserSideMenu from './user-side-menu/UserSideMenu.jsx';
import './Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import WebSideMenu from "./web-side-menu/WebSideMenu.jsx";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [secondMenuOpen, setSecondMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const secondMenuRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setSecondMenuOpen(false);
    };

    const toggleSecondMenu = () => {
        setSecondMenuOpen(!secondMenuOpen);
        setMenuOpen(false);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
        if (secondMenuRef.current && !secondMenuRef.current.contains(event.target)) {
            setSecondMenuOpen(false);
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
            <Link to="/" className="header-logo">
                <img src="/logos/capsule-v3.png" alt="capsule logo" className="header-logo-image" />
            </Link>
            <HeaderMenus toggleMenu={toggleMenu} toggleSecondMenu={toggleSecondMenu} />
            <UserSideMenu menuOpen={menuOpen} toggleMenu={toggleMenu} menuRef={menuRef} />
            <WebSideMenu menuOpen={secondMenuOpen} toggleMenu={toggleSecondMenu} menuRef={secondMenuRef} />
        </header>
    );
}

export default Header;
