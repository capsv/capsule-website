import React, { useState, useEffect } from "react";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import { translations } from "../translations.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "./SignInForm.css";

const SignInForm = () => {
    const { login } = useAuth();
    const { language } = useLanguage();
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [formFocused, setFormFocused] = useState({
        username: false,
        password: false
    });

    const content = translations[language];

    // Очистка ошибок при изменении языка или полей ввода
    useEffect(() => {
        setServerError(null);
        setErrors({});
    }, [language, username, password]);
    
    // Проверка сохранённого имени пользователя при загрузке
    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername');
        if (savedUsername) {
            setUsername(savedUsername);
            setRememberMe(true);
        }
    }, []);

    const validate = () => {
        const errors = {};
        if (!username.trim()) errors.username = content.usernameErrorBlank;
        else if (username.length < 4 || username.length > 56) errors.username = content.usernameErrorSize;

        if (!password) errors.password = content.passwordErrorBlank;
        else if (password.length < 4 || password.length > 254) errors.password = content.passwordErrorSize;

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        try {
            setLoading(true);
            setServerError(null);
            
            // Сохраняем имя пользователя, если выбрана опция "запомнить меня"
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }
            
            const response = await fetch('http://195.80.51.69:8080/api/v1/auth/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();
            if (response.ok) {
                const { access, refresh, data } = result.payload[0];
                localStorage.setItem('accessToken', access.token);
                localStorage.setItem('refreshToken', refresh.token);
                login(data);
                navigate(`/${data.username}`);
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
            setServerError(content.unexpectedError);
            console.error("Login error:", error);
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
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="signin-form-container">
            <div className="signin-form-header">
                <h2>{content.welcomeBack || "Welcome Back"}</h2>
                <p>{content.loginSubtitle || "Sign in to continue"}</p>
            </div>
            
            {serverError && (
                <div className="server-error-container">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{serverError}</span>
                </div>
            )}
            
            <form className="si-form" onSubmit={handleSubmit} noValidate>
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
                    {errors.username && <span className="si-error"><i className="fas fa-exclamation-circle"></i> {errors.username}</span>}
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
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? (content.hidePassword || "Hide password") : (content.showPassword || "Show password")}
                            title={showPassword ? (content.hidePassword || "Hide password") : (content.showPassword || "Show password")}
                            tabIndex="0"
                        >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                    {errors.password && <span className="si-error"><i className="fas fa-exclamation-circle"></i> {errors.password}</span>}
                </div>
                
                <div className="form-options">
                    <div className="remember-me">
                        <input 
                            type="checkbox" 
                            id="remember" 
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        <label htmlFor="remember">{content.rememberMe || "Remember me"}</label>
                    </div>
                    <a href="#" className="forgot-password">{content.forgotPassword || "Forgot password?"}</a>
                </div>
                
                <button 
                    type="submit" 
                    className={`si-button ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <><span className="spinner"></span> {content.loggingIn || "Signing in..."}</> 
                    ) : (
                        content.submit
                    )}
                </button>
                
                <div className="signup-option">
                    <span>{content.noAccount || "Don't have an account?"}</span>
                    <a href="/auth/up">{content.signUp || "Sign up"}</a>
                </div>
            </form>
        </div>
    );
}

export default SignInForm;
