import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './SignInPage.css';

function SignInPage() {
    const { language } = useLanguage();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const translations = {
        en: {
            signIn: "sign in",
            usernamePlaceholder: "username",
            passwordPlaceholder: "password",
            usernameErrorBlank: "should be not blank",
            usernameErrorSize: "size should be between 4 and 56",
            passwordErrorBlank: "should be not blank",
            passwordErrorSize: "size should be between 4 and 254",
            submit: "submit"
        },
        ru: {
            signIn: "вход",
            usernamePlaceholder: "имя пользователя",
            passwordPlaceholder: "пароль",
            usernameErrorBlank: "не должно быть пустым",
            usernameErrorSize: "длина должна быть от 4 до 56 символов",
            passwordErrorBlank: "не должен быть пустым",
            passwordErrorSize: "Длина должна быть от 4 до 254 символов",
            submit: "войти"
        }
    };

    const t = translations[language];

    const validate = () => {
        const errors = {};
        if (!username.trim()) errors.username = t.usernameErrorBlank;
        else if (username.length < 4 || username.length > 56) errors.username = t.usernameErrorSize;

        if (!password) errors.password = t.passwordErrorBlank;
        else if (password.length < 4 || password.length > 254) errors.password = t.passwordErrorSize;

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
        <div className="signin-container">
            <form className="signin-form" onSubmit={handleSubmit} noValidate>
                <h2>{t.signIn}</h2>
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
                <button type="submit" className="button">{t.submit}</button>
            </form>
        </div>
    );
}

export default SignInPage;
