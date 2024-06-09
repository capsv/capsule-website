import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './UserPage.css';

function UserPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    return (
        <div className="user-container">
            <h2>Welcome, {user.username}!</h2>
            <p>This is your user page. Here you will see your data.</p>
        </div>
    );
}

export default UserPage;