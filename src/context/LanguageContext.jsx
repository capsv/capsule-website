import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const LanguageContext = createContext();

const SUPPORTED_LANGUAGES = ['en', 'ru'];
const DEFAULT_LANGUAGE = 'ru';

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('language');
        return SUPPORTED_LANGUAGES.includes(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE;
    });

    const toggleLanguage = useCallback((lang) => {
        if (lang && SUPPORTED_LANGUAGES.includes(lang)) {
            setLanguage(lang);
        } else {
            // Если язык не указан или не поддерживается, переключение между en и ru
            setLanguage(prevLang => prevLang === 'en' ? 'ru' : 'en');
        }
    }, []);

    const setDocumentLanguage = useCallback((lang) => {
        document.documentElement.lang = lang;
    }, []);

    useEffect(() => {
        localStorage.setItem('language', language);
        setDocumentLanguage(language);
    }, [language, setDocumentLanguage]);

    const contextValue = {
        language,
        toggleLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
    };

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};

LanguageProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
