import React from 'react';
import './SignInImage.css';
import { useLanguage } from "../../../context/LanguageContext.jsx";

const SignInImage = () => {
    const { language } = useLanguage();
    
    // Можно добавить проверку на существование файла перед его использованием
    const imagePath = '/photos/lounge-digital-data-protection-and-information-security.gif';
    
    return (
        <div className="si-image-container">
            <div className="si-image">
                <img 
                    src={imagePath} 
                    alt={language === 'en' ? 'Secure login illustration' : 'Иллюстрация безопасного входа'} 
                    className="main-image"
                />
                
                <div className="floating-elements">
                    <div className="floating-element shield">
                        <i className="fas fa-shield-alt"></i>
                    </div>
                    <div className="floating-element lock">
                        <i className="fas fa-lock"></i>
                    </div>
                    <div className="floating-element user">
                        <i className="fas fa-user-check"></i>
                    </div>
                </div>
            </div>
            
            <div className="image-caption">
                <p>
                    {language === 'en' 
                        ? 'Safe and secure login to your mental wellness journey' 
                        : 'Безопасный вход в ваше путешествие к психическому благополучию'}
                </p>
            </div>
        </div>
    );
};

export default SignInImage;
