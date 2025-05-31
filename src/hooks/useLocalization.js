import { useLanguage } from '../context/LanguageContext';
import en from '../localization/en';
import ru from '../localization/ru';

const translations = {
    en,
    ru
};

export const useLocalization = () => {
    const { language } = useLanguage();
    
    const t = (key) => {
        const keys = key.split('.');
        let translation = translations[language];
        
        for (const k of keys) {
            if (!translation || !translation[k]) {
                console.warn(`Translation missing: ${key} for language: ${language}`);
                return key;
            }
            translation = translation[k];
        }
        
        return translation;
    };
    
    return { t };
}; 