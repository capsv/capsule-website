import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocalization } from '../../hooks/useLocalization';
import AssayModal from '../../components/assay-modal/AssayModal';
import LanguageSwitcher from '../../components/language-switcher/LanguageSwitcher';
import './UserPage.css';
import Loading from "../../components/loading/Loading.jsx";
import CarouselWithCards from "../../components/card-with-task/CarouselWithCards.jsx";

function UserPage() {
    const { user, logout, refreshAccessToken } = useAuth();
    const { t } = useLocalization();
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
        
        // Добавляем обработчик для открытия модального окна с тестом из карточек
        const handleOpenAssayModal = () => {
            setShowAssayModal(true);
        };
        
        window.addEventListener('openAssayModal', handleOpenAssayModal);
        
        return () => {
            window.removeEventListener('openAssayModal', handleOpenAssayModal);
        };
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
            <LanguageSwitcher />
            <div style={{textAlign: 'center', color: 'gray', fontSize: '15px', marginBottom: '5px'}}>
                ~ alfa version ~
            </div>
            <div className="user-profile">
                <div className="profile-avatar">
                    <span>{userData.firstName ? userData.firstName.charAt(0) : '?'}</span>
                </div>
                <div className="profile-details">
                    <div className="profile-name">
                        <h2>{userData.firstName} {userData.secondName}</h2>
                        {userData.confirm && <span className="profile-verified"><i className="fas fa-check-circle"></i></span>}
                    </div>
                    <p className="profile-username">{"@"}{userData.username}</p>
                    <p className="profile-age">{userData.age ? `${userData.age} лет` : ''}</p>
                </div>
            </div>
            <div className="assay-section">
                {userData.assay ? (
                    <div className="stat-container">
                        <h3 className="stat-header">Ваша Активность</h3>
                        <div className="heatmap-container">
                            <div className="activity-heatmap">
                                {/* Пустая тепловая карта, в будущем будет заполняться через API */}
                                {Array.from({ length: 7 }).map((_, rowIndex) => (
                                    <div key={`row-${rowIndex}`} className="heatmap-row">
                                        {Array.from({ length: 52 }).map((_, colIndex) => {
                                            // Создаем дату для каждой ячейки (начиная с начала года)
                                            const day = rowIndex + colIndex * 7;
                                            const date = new Date(new Date().getFullYear(), 0, 1 + day);
                                            const dateStr = date.toISOString().split('T')[0];
                                            
                                            return (
                                                <div 
                                                    key={`cell-${rowIndex}-${colIndex}`} 
                                                    className="heatmap-cell level-0"
                                                    data-date={dateStr}
                                                    title={`${dateStr}: Нет активности в этот день`}
                                                ></div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="heatmap-legend">
                            <span>Меньше</span>
                            <div className="legend-cells">
                                <div className="heatmap-cell level-0"></div>
                                <div className="heatmap-cell level-1"></div>
                                <div className="heatmap-cell level-2"></div>
                                <div className="heatmap-cell level-3"></div>
                                <div className="heatmap-cell level-4"></div>
                            </div>
                            <span>Больше</span>
                        </div>
                        <div className="stat-metrics">
                            <div className="stat-metric">
                                <i className="fas fa-star"></i>
                                <div className="metric-info">
                                    <span className="metric-value">{statistics?.score || 0}</span>
                                    <span className="metric-label">Общий счет</span>
                                </div>
                            </div>
                            <div className="stat-metric">
                                <i className="fas fa-check-circle"></i>
                                <div className="metric-info">
                                    <span className="metric-value">{statistics?.completedTasks || 0}</span>
                                    <span className="metric-label">Выполнено</span>
                                </div>
                            </div>
                            <div className="stat-metric">
                                <i className="fas fa-times-circle"></i>
                                <div className="metric-info">
                                    <span className="metric-value">{statistics?.missedTasks || 0}</span>
                                    <span className="metric-label">Пропущено</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="assay-prompt">
                        <h3>Начните свой путь</h3>
                        <p>Пройдите короткий тест, чтобы открыть все возможности платформы</p>
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                            <button 
                                className="take-assay-btn" 
                                onClick={() => setShowAssayModal(true)}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#4a6bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <span className="btn-text" style={{ marginRight: '8px' }}>{t('cardWithTask.passTest')}</span>
                                <span className="btn-icon">
                                    <i className="fas fa-arrow-right"></i>
                                </span>
                            </button>
                        </div>
                        <div className="assay-benefits">
                            <div className="benefit">
                                <i className="fas fa-unlock"></i>
                                <span>Разблокировать задания</span>
                            </div>
                            <div className="benefit">
                                <i className="fas fa-chart-line"></i>
                                <span>Отслеживать прогресс</span>
                            </div>
                            <div className="benefit">
                                <i className="fas fa-medal"></i>
                                <span>Получать награды</span>
                            </div>
                        </div>
                    </div>
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
