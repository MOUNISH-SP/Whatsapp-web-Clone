import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext.jsx';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { api } = useAuth();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    const fetchChats = async () => {
        try {
            const { data } = await api.get('/chats');
            setChats(data);
        } catch (error) {
            console.error(error);
        }
    };

    const accessChat = async (userId) => {
        try {
            const { data } = await api.post('/chats/access', { userId });
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
        } catch (error) {
            console.error(error);
        }
    };

    const updateChatLastMessage = (chatId, text, time) => {
        setChats(prev => {
            const updated = prev.map(c => 
                c._id === chatId ? { ...c, lastMessageText: text, lastMessageTime: time } : c
            );
            return updated.sort((a,b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
        });
    };

    const updateUserPresence = (userId, isOnline, lastSeen = null) => {
        setChats(prev => prev.map(chat => {
            const updatedParticipants = chat.participants.map(p => 
                p._id === userId ? { ...p, isOnline, lastSeen } : p
            );
            return { ...chat, participants: updatedParticipants };
        }));
        
        // Update currently selected chat view as well
        setSelectedChat(prev => {
             if(prev) {
                 const updatedParts = prev.participants.map(p => 
                    p._id === userId ? { ...p, isOnline, lastSeen } : p
                 );
                 return { ...prev, participants: updatedParts };
             }
             return prev;
        });
    };

    return (
        <ChatContext.Provider value={{ 
            chats, 
            setChats, 
            selectedChat, 
            setSelectedChat, 
            fetchChats, 
            accessChat,
            updateChatLastMessage,
            updateUserPresence
        }}>
            {children}
        </ChatContext.Provider>
    );
};
