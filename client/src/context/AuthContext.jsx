import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Basic local state initialization bypassing expensive JWT checks for simplicity
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    });

    api.interceptors.request.use(config => {
        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    });

    const login = async (username, password) => {
        const { data } = await api.post('/users/login', { username, password });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
    };

    const register = async (username, password) => {
        const { data } = await api.post('/users/register', { username, password });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, api }}>
            {children}
        </AuthContext.Provider>
    );
};
