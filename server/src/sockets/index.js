import User from '../models/User.js';
import Message from '../models/Message.js';

let onlineUsers = new Map(); // Map userId to socketId

export const setupSockets = (io) => {
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('setup', async (userData) => {
            if (!userData || !userData._id) return;
            
            socket.join(userData._id);
            socket.userId = userData._id;
            onlineUsers.set(userData._id, socket.id);
            
            try {
                await User.findByIdAndUpdate(userData._id, { isOnline: true });
                socket.broadcast.emit('user_online', userData._id);
                socket.emit('connected');
            } catch (err) {
                console.error("Error setting user online status:", err);
            }
        });

        socket.on('join_chat', (room) => {
            socket.join(room);
        });

        socket.on('leave_chat', (room) => {
            socket.leave(room);
        });

        socket.on('typing', (chatId) => socket.in(chatId).emit('typing', chatId));
        socket.on('stop_typing', (chatId) => socket.in(chatId).emit('stop_typing', chatId));

        socket.on('send_message', (newMessageReceived) => {
            const chat = newMessageReceived.chat;
            if (!chat.participants) return;

            chat.participants.forEach(user => {
                if (user._id === newMessageReceived.sender._id) return;
                socket.in(user._id).emit('receive_message', newMessageReceived);
            });
        });

        socket.on('message_delivered', async (message) => {
            try {
                // Update message in database
                await Message.findByIdAndUpdate(message._id, { status: 'delivered', deliveredAt: new Date() });
                
                // Notify sender that their message was delivered
                socket.in(message.sender._id).emit('message_delivered', message);
            } catch (err) {
                console.error(err);
            }
        });

        socket.on('message_read', async (data) => {
            // data contains chatId and senderId
            socket.in(data.senderId).emit('message_read', { chatId: data.chatId });
        });

        socket.on('disconnect', async () => {
            if (socket.userId) {
                onlineUsers.delete(socket.userId);
                try {
                    await User.findByIdAndUpdate(socket.userId, { 
                        isOnline: false, 
                        lastSeen: new Date() 
                    });
                    socket.broadcast.emit('user_offline', socket.userId);
                } catch (err) {
                    console.error("Error setting user offline status:", err);
                }
            }
        });
    });
};
