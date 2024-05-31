import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './SignUpPage.css';

function SignUpPage() {
    const { language } = useLanguage();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const translations = {
        en: {
            signUp: "sign up",
            usernamePlaceholder: "username",
            emailPlaceholder: "email",
            passwordPlaceholder: "password",
            confirmPasswordPlaceholder: "confirm password",
            usernameErrorBlank: "should be not blank",
            usernameErrorSize: "size should be between 4 and 56",
            emailErrorBlank: "should be not blank",
            emailErrorInvalid: "must match the email template",
            emailErrorSize: "size should be between 4 and 56",
            passwordErrorBlank: "should be not blank",
            passwordErrorSize: "size should be between 4 and 254",
            confirmPasswordErrorMatch: "should match the password",
            submit: "submit"
        },
        ru: {
            signUp: "регистрация",
            usernamePlaceholder: "имя пользователя",
            emailPlaceholder: "почта",
            passwordPlaceholder: "пароль",
            confirmPasswordPlaceholder: "повторите пароль",
            usernameErrorBlank: "не должно быть пустым",
            usernameErrorSize: "длина должна быть от 4 до 56 символов",
            emailErrorBlank: "не должна быть пустой",
            emailErrorInvalid: "должна соответствовать шаблону электронной почты",
            emailErrorSize: "длина должна быть от 4 до 56 символов",
            passwordErrorBlank: "не должен быть пустым",
            passwordErrorSize: "длина должна быть от 4 до 254 символов",
            confirmPasswordErrorMatch: "должен совпадать с паролем",
            submit: "отправить"
        }
    };

    const t = translations[language];

    const validate = () => {
        const errors = {};
        if (!username.trim()) errors.username = t.usernameErrorBlank;
        else if (username.length < 4 || username.length > 56) errors.username = t.usernameErrorSize;

        if (!email.trim()) errors.email = t.emailErrorBlank;
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = t.emailErrorInvalid;
        else if (email.length < 4 || email.length > 56) errors.email = t.emailErrorSize;

        if (!password) errors.password = t.passwordErrorBlank;
        else if (password.length < 4 || password.length > 254) errors.password = t.passwordErrorSize;

        if (confirmationPassword !== password) errors.confirmationPassword = t.confirmPasswordErrorMatch;

        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
        } else {
            console.log("Form Submitted");
            setErrors({});
            navigate(`/${username}`);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit} noValidate>
                <h2>{t.signUp}</h2>
                <div className="form-group">
                    <div className="input-container">
                        <i className="fas fa-user"></i>
                        <input
                            type="text"
                            placeholder={t.usernamePlaceholder}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    {errors.username && <span className="error">{errors.username}</span>}
                </div>
                <div className="form-group">
                    <div className="input-container">
                        <i className="fas fa-envelope"></i>
                        <input
                            type="email"
                            placeholder={t.emailPlaceholder}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="form-group">
                    <div className="input-container">
                        <i className="fas fa-lock"></i>
                        <input
                            type="password"
                            placeholder={t.passwordPlaceholder}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>
                <div className="form-group">
                    <div className="input-container">
                        <i className="fas fa-lock"></i>
                        <input
                            type="password"
                            placeholder={t.confirmPasswordPlaceholder}
                            value={confirmationPassword}
                            onChange={(e) => setConfirmationPassword(e.target.value)}
                        />
                    </div>
                    {errors.confirmationPassword && <span className="error">{errors.confirmationPassword}</span>}
                </div>
                <button type="submit" className="button">{t.submit}</button>
            </form>
        </div>
    );
}

export default SignUpPage;
