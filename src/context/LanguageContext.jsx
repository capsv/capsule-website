import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('language');
        return savedLanguage || 'ru';
    });

    const toggleLanguage = (lang) => {
        setLanguage(lang);
    };

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

LanguageProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useLanguage = () => useContext(LanguageContext);
