import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AssayModal from '../../components/assay-modal/AssayModal';
import './UserPage.css';
import Loading from "../../components/loading/Loading.jsx";
import CarouselWithCards from "../../components/card-with-task/CarouselWithCards.jsx";

function UserPage() {
    const { user, logout, refreshAccessToken } = useAuth();
    const [userData, setUserData] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAssayModal, setShowAssayModal] = useState(false);
    const [key, setKey] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchUserData = async (token) => {
            try {
                const [userResponse, authResponse] = await Promise.all([
                    fetch(`http://195.80.51.69:8080/api/v1/users`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }),
                    fetch(`http://195.80.51.69:8080/api/v1/auth`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }),
                ]);

                if (userResponse.status === 401 || authResponse.status === 401) {
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
                } else if (!userResponse.ok || !authResponse.ok) {
                    throw new Error('Failed to fetch user data');
                } else {
                    const userDataResult = await userResponse.json();
                    const authDataResult = await authResponse.json();
                    const combinedUserData = {
                        ...userDataResult.payload[0],
                        ...authDataResult.payload[0],
                    };

                    setUserData(combinedUserData);

                    if (combinedUserData.assay) {
                        const statsResponse = await fetch(`http://195.80.51.69:8080/api/v1/statistics`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                        });

                        if (statsResponse.ok) {
                            const statsData = await statsResponse.json();
                            setStatistics(statsData);
                        } else {
                            throw new Error('Failed to fetch statistics data');
                        }

                        const tasksResponse = await fetch(`http://195.80.51.69:8080/api/v1/tasks`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                        });

                        if (tasksResponse.ok) {
                            const tasksData = await tasksResponse.json();
                            setTasks(tasksData.payload);
                        } else {
                            throw new Error('Failed to fetch tasks data');
                        }
                    }

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
    }, [user, navigate, logout, refreshAccessToken, key]);

    const handleModalClose = () => {
        setShowAssayModal(false);
        setKey(prevKey => prevKey + 1);
    };

    if (loading) {
        return <Loading />;
    }

    if (!userData) {
        return null;
    }

    const dummyTasks = [
        { id: 1, title: 'Locked Task 1', description: 'This task is locked.', status: 'ASSIGNED' },
        { id: 2, title: 'Locked Task 2', description: 'This task is locked.', status: 'ASSIGNED' },
        { id: 3, title: 'Locked Task 3', description: 'This task is locked.', status: 'ASSIGNED' }
    ];

    return (
        <div className="user-container">
            <div style={{textAlign: 'center', color: 'gray', fontSize: '15px', marginBottom: '5px'}}>
                ~ alfa version ~
            </div>
            <div className="user-profile">
                <div className="profile-photo">
                    <img src="/logos/capsule-v2.png" alt="User profile"/>
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
            <div className="assay-section">
                {userData.assay ? (
                    <div className="stat-container">
                        <p>Score: {statistics?.score}</p>
                        <p>Completed Tasks: {statistics?.completedTasks}</p>
                        <p>Missed Tasks: {statistics?.missedTasks}</p>
                    </div>
                ) : (
                    <button onClick={() => setShowAssayModal(true)}>Take Assay</button>
                )}
            </div>
            {showAssayModal && (
                <AssayModal
                    user={userData}
                    onClose={handleModalClose}
                />
            )}
            <CarouselWithCards cards={userData.assay ? tasks : dummyTasks} assay={userData.assay}
                               token={localStorage.getItem('accessToken')}/>
        </div>
    );
}

export default UserPage;
