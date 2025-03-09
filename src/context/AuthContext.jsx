import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserData, refreshAccessToken as refreshToken } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Функция для обработки данных пользователя
    const processUserData = (userData) => {
        console.log("Processing user data:", userData);
        
        // Обработка случая, когда данные находятся в payload[0]
        if (userData && userData.status && userData.payload && Array.isArray(userData.payload) && userData.payload.length > 0) {
            console.log("Extracting user from payload:", userData.payload[0]);
            return userData.payload[0];
        }
        
        // Если данные пользователя уже в нужном формате, используем их напрямую
        if (userData && userData.username) {
            return userData;
        }
        
        // Если данные в формате API ответа
        if (userData && userData.data && userData.data.username) {
            return userData.data;
        }
        
        return userData;
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshTokenValue = localStorage.getItem('refreshToken');

        if (accessToken && refreshTokenValue) {
            setLoading(true);
            fetchUserData(accessToken)
                .then(userData => {
                    const processedData = processUserData(userData);
                    console.log("Processed user data:", processedData);
                    setIsAuthenticated(true);
                    setUser(processedData);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    refreshToken(refreshTokenValue)
                        .then(({ newAccessToken, userData }) => {
                            localStorage.setItem('accessToken', newAccessToken);
                            const processedData = processUserData(userData);
                            console.log("Processed user data after refresh:", processedData);
                            setIsAuthenticated(true);
                            setUser(processedData);
                        })
                        .catch((refreshError) => {
                            console.error("Error refreshing token:", refreshError);
                            logout();
                        });
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        const processedData = processUserData(userData);
        setIsAuthenticated(true);
        setUser(processedData);
        
        if (processedData && processedData.username) {
            navigate(`/${processedData.username}`);
        } else {
            // Если username отсутствует, перенаправляем на главную
            navigate('/');
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/');
    };

    // Добавляем функцию для обновления данных пользователя
    const updateUserData = (updatedFields) => {
        setUser(prevUser => {
            if (!prevUser) return updatedFields;
            return { ...prevUser, ...updatedFields };
        });
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            login, 
            logout, 
            loading,
            updateUserData,
            refreshAccessToken: refreshToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
