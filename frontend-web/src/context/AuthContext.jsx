import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (phone, password) => {
        try {
            const response = await api.post('/auth/login', { phone, password });
            if (response.data.token) {
                localStorage.setItem('userToken', response.data.token);
                localStorage.setItem('userInfo', JSON.stringify(response.data));
                setUser(response.data);
                return response.data;
            }
        } catch (error) {
            console.error('Login Error:', error.response?.data?.message || error.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    useEffect(() => {
        try {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                setUser(JSON.parse(userInfo));
            }
        } catch (error) {
            console.log('Error reading local auth data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
