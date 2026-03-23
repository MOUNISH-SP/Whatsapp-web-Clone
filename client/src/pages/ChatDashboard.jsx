import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import Sidebar from '../components/Sidebar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import StatusOverlay from '../components/StatusOverlay.jsx';
import CallOverlay from '../components/CallOverlay.jsx';

const ENDPOINT = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function ChatDashboard() {
    const { user, api } = useAuth();
    const [socket, setSocket] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
    
    // UI states
    const [showStatus, setShowStatus] = useState(false);
    const [callData, setCallData] = useState({ active: false, type: '', receiver: null });

    useEffect(() => {
        if (user?.theme === 'dark') document.documentElement.classList.add('dark-theme');
        else document.documentElement.classList.remove('dark-theme');
    }, [user?.theme]);

    useEffect(() => {
        const handleStatus = () => setShowStatus(true);
        const handleAudio = (e) => setCallData({ active: true, type: 'audio', receiver: e.detail });
        const handleVideo = (e) => setCallData({ active: true, type: 'video', receiver: e.detail });

        window.addEventListener('open-status', handleStatus);
        window.addEventListener('audio-call', handleAudio);
        window.addEventListener('video-call', handleVideo);

        return () => {
            window.removeEventListener('open-status', handleStatus);
            window.removeEventListener('audio-call', handleAudio);
            window.removeEventListener('video-call', handleVideo);
        };
    }, []);

    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);
    
    useEffect(() => {
        // Authenticate Socket session
        const newSocket = io(ENDPOINT);
        setSocket(newSocket);
        newSocket.emit('setup', user._id);

        return () => newSocket.disconnect();
    }, [user]);

    useEffect(() => {
        // 1. Fetch Global Users
        api.get('/users').then(r => setUsers(r.data)).catch(console.error);

        // 2. Identify Pending Deliveries
        // Immediately updates DB changing all "sent" bound to me into "delivered", effectively notifying senders natively!
        api.put('/messages/mark-delivered').catch(console.error);
    }, [api]);

    useEffect(() => {
        if (!selectedUser || !socket) return;
        const fetchMessages = async () => {
             try {
                 const { data } = await api.get(`/messages/${selectedUser._id}`);
                 setMessages(data);

                 // Check for newly unread records now that we are looking strictly at this user
                 const unreadIds = data
                     .filter(m => (m.receiver === user._id || m.receiver._id === user._id) && m.status !== 'read')
                     .map(m => m._id);

                 if (unreadIds.length > 0) {
                     socket.emit('message_read', { messageIds: unreadIds, senderId: selectedUser._id });
                     await api.put('/messages/status', { messageIds: unreadIds, status: 'read' });
                     setMessages(prev => prev.map(m => unreadIds.includes(m._id) ? { ...m, status: 'read' } : m));
                 }
             } catch (error) {
                 console.error("Failed to fetch messages");
             }
        };
        fetchMessages();
    }, [selectedUser, api, socket, user._id]);

    useEffect(() => {
        if (!socket) return;

        // Presence Logic Maps
        socket.on('user_online', (userId) => {
             setUsers(prev => prev.map(u => u._id === userId ? { ...u, isOnline: true } : u));
             if(selectedUser && selectedUser._id === userId) setSelectedUser(prev => ({...prev, isOnline: true}));
        });
        socket.on('user_offline', (userId) => {
             setUsers(prev => prev.map(u => u._id === userId ? { ...u, isOnline: false } : u));
             if(selectedUser && selectedUser._id === userId) setSelectedUser(prev => ({...prev, isOnline: false}));
        });
        
        // Single TCP Listener routing
        const messageListener = (newMessage) => {
            const senderId = newMessage.sender._id || newMessage.sender;
            const senderName = newMessage.sender.username || "New Message";
            
            if (selectedUser && senderId === selectedUser._id) {
                // I have the chat physically open -> Map DOUBLE BLUE TICK
                setMessages(prev => [...prev, { ...newMessage, status: 'read' }]);
                socket.emit('message_read', { messageIds: [newMessage._id], senderId });
                api.put('/messages/status', { messageIds: [newMessage._id], status: 'read' }).catch(console.error);
            } else {
                // I received it in background safely -> Map DOUBLE GRAY TICK
                socket.emit('message_delivered', { messageIds: [newMessage._id], senderId });
                api.put('/messages/status', { messageIds: [newMessage._id], status: 'delivered' }).catch(console.error);

                // Browser Notification Trigger
                if (Notification.permission === "granted" && document.visibilityState !== "visible") {
                    new Notification(senderName, {
                        body: newMessage.text || "Sent a media file",
                        icon: "/favicon.ico"
                    });
                }
            }
        };

        const deliveredListener = ({ messageIds }) => {
            // Safely convert my sent 1-ticks into Double Grays!
            setMessages(prev => prev.map(m => messageIds.includes(m._id) && m.status === 'sent' ? { ...m, status: 'delivered' } : m));
        };

        const readListener = ({ messageIds }) => {
            // Safely convert 2-grays into Double Blues!
            setMessages(prev => prev.map(m => messageIds.includes(m._id) ? { ...m, status: 'read' } : m));
        };

        socket.on('receive_message', messageListener);
        socket.on('message_delivered', deliveredListener);
        socket.on('message_read', readListener);

        return () => {
            socket.off('user_online');
            socket.off('user_offline');
            socket.off('receive_message', messageListener);
            socket.off('message_delivered', deliveredListener);
            socket.off('message_read', readListener);
        }
    }, [socket, selectedUser, api]);

    return (
        <>
            <div className="flex w-full h-screen bg-[#d1d7db] relative overflow-hidden font-sans">
                <div className="absolute top-0 w-full h-[127px] bg-[#00a884] z-0 hidden md:block"></div>
                <div className="w-full h-full md:w-[95%] md:h-[95%] xl:w-[1600px] xl:mx-auto md:my-auto bg-white shadow-md z-10 flex flex-row relative overflow-hidden md:rounded-sm">
                    <div className={`w-full md:w-[35%] lg:w-[30%] flex-col border-r border-[#d1d7db]/30 bg-white ${isMobileChatOpen ? 'hidden md:flex' : 'flex'}`}>
                         <Sidebar users={users} selectedUser={selectedUser} onSelectUser={(u) => { setSelectedUser(u); setIsMobileChatOpen(true); }} />
                    </div>
                    <div className={`w-full md:w-[65%] lg:w-[70%] flex-col relative bg-[#efeae2] ${!isMobileChatOpen ? 'hidden md:flex' : 'flex'}`}>
                         <ChatWindow selectedUser={selectedUser} messages={messages} setMessages={setMessages} onBack={() => setIsMobileChatOpen(false)} />
                    </div>
                </div>
            </div>
            {showStatus && <StatusOverlay onClose={() => setShowStatus(false)} user={user} />}
            {callData.active && <CallOverlay type={callData.type} receiver={callData.receiver} onClose={() => setCallData({ active: false, type: '', receiver: null })} />}
        </>
    );
}
