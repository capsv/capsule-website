import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserPageContext = createContext();

export const UserPageProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const { refreshAccessToken, logout } = useAuth();
    const navigate = useNavigate();

    const loadUserData = async (token) => {
        try {
            const [userResponse, authResponse, statsResponse] = await Promise.all([
                fetch('http://localhost:8080/api/v1/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }),
                fetch('http://localhost:8080/api/v1/auth', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }),
                fetch('http://localhost:8080/api/v1/statistics', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }),
            ]);

            if (userResponse.status === 401 || authResponse.status === 401 || statsResponse.status === 401) {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    try {
                        const { newAccessToken } = await refreshAccessToken(refreshToken);
                        localStorage.setItem('accessToken', newAccessToken);
                        await loadUserData(newAccessToken);
                        return;
                    } catch {
                        logout();
                    }
                } else {
                    logout();
                }
            } else if (!userResponse.ok || !authResponse.ok || !statsResponse.ok) {
                throw new Error('Failed to fetch data');
            } else {
                const userData = await userResponse.json();
                const authData = await authResponse.json();
                const statsData = await statsResponse.json();

                const combinedUserData = {
                    username: userData.payload[0].username,
                    firstName: userData.payload[0].firstName,
                    secondName: userData.payload[0].secondName,
                    age: userData.payload[0].age,
                    email: authData.payload[0].email,
                    confirm: authData.payload[0].confirm,
                    assay: authData.payload[0].assay,
                    score: statsData.score,
                    completedTasks: statsData.completedTasks,
                    missedTasks: statsData.missedTasks,
                };

                setUserData(combinedUserData);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            logout();
        }
    };

    return (
        <UserPageContext.Provider value={{ userData, loadUserData }}>
            {children}
        </UserPageContext.Provider>
    );
};

export const useUserPage = () => useContext(UserPageContext);
