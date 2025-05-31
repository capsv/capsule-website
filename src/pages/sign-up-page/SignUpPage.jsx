import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { translations } from "./translations.js";
import LegalModal from "../../components/legal-modal/LegalModal.jsx";
import './SignUpPage.css';

function SignUpPage() {
    const { language } = useLanguage();
    const { login } = useAuth();
    const navigate = useNavigate();
    
    // Состояния полей формы
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Состояния UI
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(null);
    const [formFocused, setFormFocused] = useState({
        username: false,
        email: false,
        password: false,
        confirmPassword: false
    });
    
    // Состояния для модальных окон и чекбоксов
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('terms'); // 'terms' или 'privacy'
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    
    // Переводы
    const content = translations[language];
    
    // Очистка ошибок при изменении полей или языка
    useEffect(() => {
        setServerError(null);
        setErrors({});
    }, [language, username, email, password, confirmPassword]);
    
    // При монтировании компонента прокручиваем страницу вверх
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `${content.pageTitle || "Sign Up"} | Capsule`;
    }, [language, content.pageTitle]);

    const validate = () => {
        const errors = {};
        // Валидация имени пользователя
        if (!username.trim()) {
            errors.username = content.usernameErrorBlank;
        } else if (username.length < 4 || username.length > 56) {
            errors.username = content.usernameErrorSize;
        }

        // Валидация email
        if (!email.trim()) {
            errors.email = content.emailErrorBlank;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = content.emailErrorInvalid;
        } else if (email.length < 4 || email.length > 56) {
            errors.email = content.emailErrorSize;
        }

        // Валидация пароля
        if (!password) {
            errors.password = content.passwordErrorBlank;
        } else if (password.length < 4 || password.length > 254) {
            errors.password = content.passwordErrorSize;
        }

        // Валидация подтверждения пароля
        if (confirmPassword !== password) {
            errors.confirmPassword = content.confirmPasswordErrorMatch;
        }

        // Валидация согласия с условиями
        if (!agreeTerms || !agreePrivacy) {
            errors.agreement = content.agreementRequired;
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);
            setServerError(null);
            
            const response = await fetch('http://195.80.51.69:8080/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username, 
                    email, 
                    password, 
                    confirmationPassword: confirmPassword 
                }),
            });

            const result = await response.json();
            
            if (response.ok) {
                const { access, refresh, data } = result.payload[0];
                localStorage.setItem('accessToken', access.token);
                localStorage.setItem('refreshToken', refresh.token);

                login(data);
                navigate(`/`);
            } else {
                if (result.payload) {
                    const serverErrors = {};
                    result.payload.forEach(item => {
                        if (item.field) {
                            serverErrors[item.field] = item.error;
                        } else {
                            setServerError(item.error || content.defaultError);
                        }
                    });
                    setErrors(serverErrors);
                } else {
                    setServerError(result.message || content.defaultError);
                }
            }
        } catch (error) {
            console.error("Registration error:", error);
            setServerError(content.unexpectedError);
        } finally {
            setLoading(false);
        }
    };
    
    const handleFocus = (field) => {
        setFormFocused(prev => ({ ...prev, [field]: true }));
    };
    
    const handleBlur = (field) => {
        setFormFocused(prev => ({ ...prev, [field]: false }));
    };
    
    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const openModal = (type) => {
        setModalType(type);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    // Проверяем, можно ли активировать кнопку
    const isSubmitDisabled = loading || !agreeTerms || !agreePrivacy;

    return (
        <div className="signup-container">
            <div className="signup-content-wrapper">
                <div className="signup-header">
                    <h1>{content.signUp}</h1>
                    <p>{content.signUpSubtitle || "Create your account to get started"}</p>
                </div>
                
                <div className="signup-main-content">
                    <div className="signup-image-container">
                        <div className="signup-image">
                            <img 
                                src="/photos/pablita-face-id.gif" 
                                alt={language === 'en' ? 'Sign up illustration' : 'Иллюстрация регистрации'} 
                                className="main-image"
                            />
                            
                            <div className="floating-elements">
                                <div className="floating-element user-plus">
                                    <i className="fas fa-user-plus"></i>
                                </div>
                                <div className="floating-element check">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="floating-element shield">
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                            </div>
                        </div>
                        
                        <div className="image-caption">
                            <p>
                                {language === 'en' 
                                    ? 'Join our community for better mental health' 
                                    : 'Присоединяйтесь к нашему сообществу для улучшения психического здоровья'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="signup-form-container">
                        <div className="signup-form-header">
                            <h2>{content.createAccount || "Create Account"}</h2>
                            <p>{content.fillDetails || "Please fill in your details"}</p>
                        </div>
                        
                        {serverError && (
                            <div className="server-error-container">
                                <i className="fas fa-exclamation-circle"></i>
                                <span>{serverError}</span>
                            </div>
                        )}
                        
                        <form className="signup-form" onSubmit={handleSubmit} noValidate>
                            <div className={`form-group ${errors.username ? 'has-error' : ''} ${formFocused.username ? 'focused' : ''}`}>
                                <label htmlFor="username">{content.usernameLabel || "Username"}</label>
                                <div className="input-container">
                                    <i className="fas fa-user"></i>
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder={content.usernamePlaceholder}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onFocus={() => handleFocus('username')}
                                        onBlur={() => handleBlur('username')}
                                    />
                                </div>
                                {errors.username && <span className="form-error"><i className="fas fa-exclamation-circle"></i> {errors.username}</span>}
                            </div>
                            
                            <div className={`form-group ${errors.email ? 'has-error' : ''} ${formFocused.email ? 'focused' : ''}`}>
                                <label htmlFor="email">{content.emailLabel || "Email"}</label>
                                <div className="input-container">
                                    <i className="fas fa-envelope"></i>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder={content.emailPlaceholder}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => handleFocus('email')}
                                        onBlur={() => handleBlur('email')}
                                    />
                                </div>
                                {errors.email && <span className="form-error"><i className="fas fa-exclamation-circle"></i> {errors.email}</span>}
                            </div>
                            
                            <div className={`form-group ${errors.password ? 'has-error' : ''} ${formFocused.password ? 'focused' : ''}`}>
                                <label htmlFor="password">{content.passwordLabel || "Password"}</label>
                                <div className="input-container">
                                    <i className="fas fa-lock"></i>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={content.passwordPlaceholder}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => handleFocus('password')}
                                        onBlur={() => handleBlur('password')}
                                    />
                                    <button 
                                        type="button" 
                                        className="toggle-password"
                                        onClick={() => togglePasswordVisibility('password')}
                                        aria-label={showPassword ? (content.hidePassword || "Hide password") : (content.showPassword || "Show password")}
                                        title={showPassword ? (content.hidePassword || "Hide password") : (content.showPassword || "Show password")}
                                        tabIndex="0"
                                    >
                                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                                {errors.password && <span className="form-error"><i className="fas fa-exclamation-circle"></i> {errors.password}</span>}
                            </div>
                            
                            <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''} ${formFocused.confirmPassword ? 'focused' : ''}`}>
                                <label htmlFor="confirmPassword">{content.confirmPasswordLabel || "Confirm Password"}</label>
                                <div className="input-container">
                                    <i className="fas fa-lock"></i>
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder={content.confirmPasswordPlaceholder}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onFocus={() => handleFocus('confirmPassword')}
                                        onBlur={() => handleBlur('confirmPassword')}
                                    />
                                    <button 
                                        type="button" 
                                        className="toggle-password"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        aria-label={showConfirmPassword ? (content.hidePassword || "Hide password") : (content.showPassword || "Show password")}
                                        title={showConfirmPassword ? (content.hidePassword || "Hide password") : (content.showPassword || "Show password")}
                                        tabIndex="0"
                                    >
                                        <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                                {errors.confirmPassword && <span className="form-error"><i className="fas fa-exclamation-circle"></i> {errors.confirmPassword}</span>}
                            </div>
                            
                            <div className="terms-policy">
                                <p>
                                    {content.termsText} {' '}
                                    <button 
                                        type="button" 
                                        className="legal-link"
                                        onClick={() => openModal('terms')}
                                    >
                                        {content.terms}
                                    </button> {content.andText} {' '}
                                    <button 
                                        type="button" 
                                        className="legal-link"
                                        onClick={() => openModal('privacy')}
                                    >
                                        {content.privacy}
                                    </button>
                                </p>
                                
                                <div className="agreement-checkboxes">
                                    <div className="checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={agreeTerms}
                                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                                className="checkbox-input"
                                            />
                                            <span className="checkbox-custom"></span>
                                            <span className="checkbox-text">{content.agreeTerms}</span>
                                        </label>
                                    </div>
                                    
                                    <div className="checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={agreePrivacy}
                                                onChange={(e) => setAgreePrivacy(e.target.checked)}
                                                className="checkbox-input"
                                            />
                                            <span className="checkbox-custom"></span>
                                            <span className="checkbox-text">{content.agreePrivacy}</span>
                                        </label>
                                    </div>
                                </div>
                                
                                {errors.agreement && (
                                    <span className="form-error agreement-error">
                                        <i className="fas fa-exclamation-circle"></i> {errors.agreement}
                                    </span>
                                )}
                            </div>
                            
                            <button 
                                type="submit" 
                                className={`signup-button ${loading ? 'loading' : ''} ${isSubmitDisabled ? 'disabled' : ''}`}
                                disabled={isSubmitDisabled}
                            >
                                {loading ? (
                                    <><span className="spinner"></span> {content.registering || "Registering..."}</> 
                                ) : (
                                    content.submit
                                )}
                            </button>
                            
                            <div className="login-option">
                                <span>{content.haveAccount || "Already have an account?"}</span>
                                <a href="/auth/in">{content.signIn || "Sign in"}</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <LegalModal
                isOpen={modalOpen}
                onClose={closeModal}
                type={modalType}
                language={language}
            />
        </div>
    );
}

export default SignUpPage;
