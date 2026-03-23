import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    useEffect(() => {
        if (user) {
            const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
            setSocket(newSocket);

            newSocket.emit('setup', user);
            newSocket.on('connected', () => setIsSocketConnected(true));

            return () => {
                newSocket.disconnect();
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsSocketConnected(false);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, isSocketConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
