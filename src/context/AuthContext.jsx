import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        const storedUserData = localStorage.getItem('userData');

        if (accessToken && storedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
            setUserData(storedUserData ? JSON.parse(storedUserData) : null);
        }
    }, []);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setUserData(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userData');
        navigate('/');
    };

    const updateUserData = (updatedData) => {
        setUserData((prevData) => {
            const newUserData = { ...prevData, ...updatedData };
            localStorage.setItem('userData', JSON.stringify(newUserData));
            return newUserData;
        });
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, userData, setUserData, login, logout, updateUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
