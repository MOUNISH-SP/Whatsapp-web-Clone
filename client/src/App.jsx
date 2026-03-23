import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ChatDashboard from './pages/ChatDashboard';

export default function App() {
    const { user } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                <Route path="/" element={user ? <ChatDashboard /> : <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}
