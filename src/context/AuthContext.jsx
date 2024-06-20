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
                    // Handle error (e.g., navigate to login page)
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
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
