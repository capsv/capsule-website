import React, { useState } from 'react';
import './SignUpPage.css';

function SignUpPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errors = {};
        if (!username.trim()) errors.username = "should be not blank";
        else if (username.length < 4 || username.length > 56) errors.username = "size should be between 4 and 56";

        if (!email.trim()) errors.email = "should be not blank";
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "must match the email template";
        else if (email.length < 4 || email.length > 56) errors.email = "size should be between 4 and 56";

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
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && <span className="error">{errors.username}</span>}
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <span className="error">{errors.password}</span>}
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmationPassword}
                        onChange={(e) => setConfirmationPassword(e.target.value)}
                    />
                    {errors.confirmationPassword && <span className="error">{errors.confirmationPassword}</span>}
                </div>
                <button type="submit" className="button">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUpPage;
