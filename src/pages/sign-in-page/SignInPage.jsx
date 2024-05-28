import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignInPage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function SignInPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!username.trim()) errors.username = "username should be not blank";
        else if (username.length < 4 || username.length > 56) errors.username = "username size should be between 4 and 56";

        if (!password) errors.password = "password should be not blank";
        else if (password.length < 4 || password.length > 254) errors.password = "password size should be between 4 and 254";

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
                <h2>sign in</h2>
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
                <button type="submit" className="button">sign in</button>
            </form>
        </div>
    );
}

export default SignInPage;
