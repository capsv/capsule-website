import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './UserPage.css';

function UserPage() {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchUserData = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/v1/users/${user.username}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const result = await response.json();
                setUserData(result.payload[0]);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/');
            }
        };

        fetchUserData();
    }, [user, navigate]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-container">
            <div className="user-profile">
                <div className="profile-photo">
                    <img src="/logos/capsule-v2.png" alt="User profile" />
                </div>
                <div className="profile-details">
                    <h2>{userData.firstName} {userData.secondName}</h2>
                    <p>{userData.username}</p>
                </div>
            </div>
        </div>
    );
}

export default UserPage;
