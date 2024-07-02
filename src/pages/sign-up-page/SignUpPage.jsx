import React, { useState } from 'react';
import styles from './SignUpPage.module.css';
import { useLanguage } from "../../context/LanguageContext.jsx";
import { translations } from "./translations.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function SignUpPage() {
    const { language } = useLanguage();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();

    const content = translations[language];

    const validate = () => {
        const errors = {};
        if (!username.trim()) errors.username = content.usernameErrorBlank;
        else if (username.length < 4 || username.length > 56) errors.username = content.usernameErrorSize;

        if (!email.trim()) errors.email = content.emailErrorBlank;
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = content.emailErrorInvalid;
        else if (email.length < 4 || email.length > 56) errors.email = content.emailErrorSize;

        if (!password) errors.password = content.passwordErrorBlank;
        else if (password.length < 4 || password.length > 254) errors.password = content.passwordErrorSize;

        if (confirmationPassword !== password) errors.confirmationPassword = content.confirmPasswordErrorMatch;

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
            const response = await fetch('http://195.80.51.69:8080/api/v1/auth/register', { //localhost:8080
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

                login(data);
                navigate(`/`);
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
        <div className={styles.signupContainer}>
            <div className={styles.signupHeader}>
                <h2>{content.signUp}</h2>
            </div>
            <div className={styles.signupContent}>
                <form className={styles.signupForm} onSubmit={handleSubmit} noValidate>
                    <div className={styles.formGroup}>
                        <div className={styles.inputContainer}>
                            <i className="fas fa-user"></i>
                            <input
                                type="text"
                                placeholder={content.usernamePlaceholder}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        {errors.username && <span className={styles.error}>{errors.username}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <div className={styles.inputContainer}>
                            <i className="fas fa-envelope"></i>
                            <input
                                type="email"
                                placeholder={content.emailPlaceholder}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {errors.email && <span className={styles.error}>{errors.email}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <div className={styles.inputContainer}>
                            <i className="fas fa-lock"></i>
                            <input
                                type="password"
                                placeholder={content.passwordPlaceholder}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {errors.password && <span className={styles.error}>{errors.password}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <div className={styles.inputContainer}>
                            <i className="fas fa-lock"></i>
                            <input
                                type="password"
                                placeholder={content.confirmPasswordPlaceholder}
                                value={confirmationPassword}
                                onChange={(e) => setConfirmationPassword(e.target.value)}
                            />
                        </div>
                        {errors.confirmationPassword && <span className={styles.error}>{errors.confirmationPassword}</span>}
                        {serverError && <div className={styles.error}>{serverError}</div>}
                    </div>
                    <button type="submit" className={styles.button}>{content.submit}</button>
                </form>
                <div className={styles.signupImage}>
                    <img src="/photos/pablita-face-id.gif" alt="Sign up illustration" />
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;
