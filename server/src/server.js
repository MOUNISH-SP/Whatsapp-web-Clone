import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import path from 'path';

connectDB();

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: '*' }));
app.use(express.json());

// Exposes user uploads safely mapping backwards explicitly onto root endpoint directories dynamically!
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const io = new Server(httpServer, {
    cors: { origin: '*' },
});

io.on('connection', (socket) => {
    socket.on('setup', (userId) => {
        socket.userId = userId;
        socket.join(userId);
        socket.emit('connected');
        socket.broadcast.emit('user_online', userId);
    });

    socket.on('message_delivered', ({ messageIds, senderId }) => {
        socket.to(senderId).emit('message_delivered', { messageIds });
    });

    socket.on('message_read', ({ messageIds, senderId }) => {
        socket.to(senderId).emit('message_read', { messageIds });
    });

    socket.on('disconnect', () => {
        if (socket.userId) {
            socket.broadcast.emit('user_offline', socket.userId);
        }
    });
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
