import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { translations } from './translations';

function SignUpForm() {
    const { language } = useLanguage();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, confirmationPassword }),
            });

            const result = await response.json();
            if (response.ok) {
                const { access, refresh, data } = result.payload[0];
                localStorage.setItem('accessToken', access.token);
                localStorage.setItem('refreshToken', refresh.token);
                localStorage.setItem('user', JSON.stringify(data));
                login(data);
                navigate(`/${data.username}`);
            } else {
                if (result.payload) {
                    const serverErrors = {};
                    result.payload.forEach(item => {
                        if (item.field) {
                            serverErrors[item.field] = item.error;
                        } else {
                            setServerError(item.error);
                        }
                    });
                    setErrors(serverErrors);
                } else {
                    setServerError(result.message);
                }
            }
        } catch (error) {
            setServerError('An unexpected error occurred.');
        }
    };

    return (
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
                {serverError && <div className="error">{serverError}</div>}
            </div>
            <button type="submit" className="button">{t.submit}</button>
        </form>
    );
}

export default SignUpForm;
