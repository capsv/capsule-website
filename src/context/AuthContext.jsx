import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (accessToken && refreshToken) {
            fetchUserData(accessToken)
                .then(userData => {
                    setIsAuthenticated(true);
                    setUser(userData);
                })
                .catch(() => {
                    refreshAccessToken(refreshToken)
                        .then(({ newAccessToken, userData }) => {
                            localStorage.setItem('accessToken', newAccessToken);
                            setIsAuthenticated(true);
                            setUser(userData);
                        })
                        .catch(() => {
                            logout();
                        });
                });
        }
    }, []);

    const fetchUserData = async (token) => {
        const response = await fetch('http://localhost:8080/api/v1/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        return response.json();
    };

    const refreshAccessToken = async (refreshToken) => {
        const response = await fetch('http://localhost:8080/api/v1/auth/token/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: refreshToken }),
        });
        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }
        const data = await response.json();
        if (data.status !== "SUCCESS") {
            throw new Error(data.message);
        }
        const newAccessToken = data.payload[0].access.token;
        const userData = data.payload[0].data;
        return { newAccessToken, userData };
    };

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        navigate(`/${userData.username}`);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
