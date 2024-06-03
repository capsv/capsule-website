import React from 'react';
import './UserPage.css';
import { useAuth } from '../../context/AuthContext';

function UserPage() {
    const { user } = useAuth();

    return (
        <div className="user-container">
            <h2>Welcome, {user.username}!</h2>
            <p>This is your user page. Here you will see your data.</p>
        </div>
    );
}

export default UserPage;
