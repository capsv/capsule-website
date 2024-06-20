import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AssayModal from '../../components/assay-modal/AssayModal';
import './UserPage.css';

function UserPage() {
    const { user, logout, refreshAccessToken } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAssayModal, setShowAssayModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchUserData = async (token) => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/users`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        try {
                            const { newAccessToken } = await refreshAccessToken(refreshToken);
                            localStorage.setItem('accessToken', newAccessToken);
                            await fetchUserData(newAccessToken);
                        } catch {
                            logout();
                        }
                    } else {
                        logout();
                    }
                } else if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                } else {
                    const result = await response.json();
                    const userDataFromResponse = result.payload[0];
                    setUserData(userDataFromResponse);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/');
            }
        };

        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            fetchUserData(accessToken);
        } else {
            navigate('/');
        }
    }, [user, navigate, logout, refreshAccessToken]);

    if (loading) {
        return (
            <div className="user-container loading">
                <div>Loading...</div>
            </div>
        );
    }

    if (!userData) {
        return null;
    }

    return (
        <div className="user-container">
            <div className="user-profile">
                <div className="profile-photo">
                    <img src="/logos/capsule-v2.png" alt="User profile" />
                </div>
                <div className="profile-details">
                    <h2>
                        {userData.firstName} {userData.secondName}
                        {userData.confirm && <i className="fas fa-check-circle confirm-icon"></i>}
                    </h2>
                    <p>{"@"}{userData.username}</p>
                    <div>{userData.age}</div>
                </div>
            </div>
            {!userData.assay && (
                <div className="assay-section">
                    <button onClick={() => setShowAssayModal(true)}>Take Assay</button>
                </div>
            )}
            {showAssayModal && (
                <AssayModal
                    user={userData}
                    onClose={() => setShowAssayModal(false)}
                />
            )}
        </div>
    );
}

export default UserPage;
