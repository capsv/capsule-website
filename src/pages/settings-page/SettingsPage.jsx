import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';
import VerifyEmail from '../../components/verify-email/VerifyEmail.jsx';

function SettingsPage() {
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        secondName: '',
        age: '',
    });
    const [errors, setErrors] = useState({});
    const [messages, setMessages] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                secondName: user.secondName || '',
                age: user.age || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = (field, value) => {
        let error = '';
        if ((field === 'firstName' || field === 'secondName') && (!value.trim() || value.length < 4 || value.length > 128)) {
            error = `${field} should be between 4 and 128 characters`;
        } else if (field === 'age' && (value <= 0 || value >= 128)) {
            error = 'Age should be between 1 and 127';
        }
        return error;
    };

    const handleSubmit = async (field) => {
        const error = validate(field, formData[field]);
        if (error) {
            setErrors({ ...errors, [field]: error });
            return;
        } else {
            setErrors({ ...errors, [field]: '' });
        }

        const updatedField = { [field]: formData[field] };

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:8080/api/v1/users/${user.username}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedField),
            });

            const result = await response.json();
            if (response.ok) {
                setMessages({ ...messages, [field]: 'Updated successfully' });
            } else {
                setMessages({ ...messages, [field]: 'Failed to update' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessages({ ...messages, [field]: 'An error occurred' });
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:8080/api/v1/users/${user.username}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                logout();
                navigate('/');
            } else {
                setMessages({ ...messages, delete: 'Failed to delete account' });
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            setMessages({ ...messages, delete: 'An error occurred' });
        }
    };

    return (
        <div className="settings-container">
            <h2>Settings</h2>
            <div className="settings-form">
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <div className="input-container">
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        <button type="button" className="text-button" onClick={() => handleSubmit('firstName')}>
                            Save
                        </button>
                    </div>
                    {errors.firstName && <span className="error">{errors.firstName}</span>}
                    {messages.firstName && <span className="message">{messages.firstName}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="secondName">Second Name</label>
                    <div className="input-container">
                        <input
                            type="text"
                            id="secondName"
                            name="secondName"
                            value={formData.secondName}
                            onChange={handleChange}
                        />
                        <button type="button" className="text-button" onClick={() => handleSubmit('secondName')}>
                            Save
                        </button>
                    </div>
                    {errors.secondName && <span className="error">{errors.secondName}</span>}
                    {messages.secondName && <span className="message">{messages.secondName}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <div className="input-container">
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                        />
                        <button type="button" className="text-button" onClick={() => handleSubmit('age')}>
                            Save
                        </button>
                    </div>
                    {errors.age && <span className="error">{errors.age}</span>}
                    {messages.age && <span className="message">{messages.age}</span>}
                </div>
                <div className="form-group">
                    <VerifyEmail email={user.email} username={user.username} onVerify={() => setMessages({ ...messages, email: 'Email verified successfully' })} />
                </div>
                <div className="form-group">
                    <button type="button" className="delete-button" onClick={handleDeleteAccount}>
                        Delete Account
                    </button>
                    {messages.delete && <span className="error">{messages.delete}</span>}
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
