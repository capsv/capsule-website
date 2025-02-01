import React from 'react';
import {useAuth} from '../../../context/AuthContext.jsx';
import './HeaderMenus.css';

const HeaderMenus = ({toggleMenu, toggleSecondMenu}) => {
    const {isAuthenticated} = useAuth();

    return (
        <div className="header-buttons">
            {!isAuthenticated ? (
                <>
                    <div className="icon-button" onClick={toggleMenu}>
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="icon-button" onClick={toggleSecondMenu}>
                        <i className="fas fa-bars"></i>
                    </div>
                </>
            ) : (
                <>
                    <div className="icon-button" onClick={toggleMenu}>
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="icon-button" onClick={toggleSecondMenu}>
                        <i className="fas fa-bars"></i>
                    </div>
                </>
            )}
        </div>
    );
};

export default HeaderMenus;
