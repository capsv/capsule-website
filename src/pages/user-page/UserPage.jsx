import React from 'react';
import { useParams } from 'react-router-dom';
import './UserPage.css';

function UserPage() {
    const { username } = useParams();

    return (
        <div className="user-container">
            <h2>Welcome, {username}!</h2>
            <p>This is your user page. Here you will see your data.</p>
        </div>
    );
}

export default UserPage;
