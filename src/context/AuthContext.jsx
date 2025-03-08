import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserData, refreshAccessToken as refreshToken } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshTokenValue = localStorage.getItem('refreshToken');

        if (accessToken && refreshTokenValue) {
            setLoading(true);
            fetchUserData(accessToken)
                .then(userData => {
                    setIsAuthenticated(true);
                    setUser(userData);
                })
                .catch(() => {
                    refreshToken(refreshTokenValue)
                        .then(({ newAccessToken, userData }) => {
                            localStorage.setItem('accessToken', newAccessToken);
                            setIsAuthenticated(true);
                            setUser(userData);
                        })
                        .catch(() => {
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
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
