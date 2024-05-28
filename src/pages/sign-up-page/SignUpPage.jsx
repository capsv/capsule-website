import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';

function SignUpPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!username.trim()) errors.username = "username should be not blank";
        else if (username.length < 4 || username.length > 56) errors.username = "username size should be between 4 and 56";

        if (!email.trim()) errors.email = "email should be not blank";
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "email must match the email template";
        else if (email.length < 4 || email.length > 56) errors.email = "email size should be between 4 and 56";

        if (!password) errors.password = "password should be not blank";
        else if (password.length < 4 || password.length > 254) errors.password = "password size should be between 4 and 254";

        if (confirmationPassword !== password) errors.confirmationPassword = "should match the password";

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
                <h2>sign up</h2>
                <div className="form-group">
                    <div className="input-container">
                        <i className="fas fa-user"></i>
                        <input
                            type="text"
                            placeholder="username"
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
                            placeholder="email"
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
                            placeholder="password"
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
                            placeholder="confirm password"
                            value={confirmationPassword}
                            onChange={(e) => setConfirmationPassword(e.target.value)}
                        />
                    </div>
                    {errors.confirmationPassword && <span className="error">{errors.confirmationPassword}</span>}
                </div>
                <button type="submit" className="button">sign up</button>
            </form>
        </div>
    );
}

export default SignUpPage;
