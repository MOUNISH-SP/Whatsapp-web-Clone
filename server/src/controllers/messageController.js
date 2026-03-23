import Message from '../models/Message.js';
import User from '../models/User.js';

export const getMessages = async (req, res) => {
    try {
        const { userId } = req.params; 
        const myId = req.user.id;

        const chatUser = await User.findById(userId);
        let messages;
        if (chatUser && chatUser.isGroup) {
             messages = await Message.find({ receiver: userId }).sort({ createdAt: 1 }).populate('sender', 'username');
        } else {
             messages = await Message.find({
                 $or: [
                     { sender: myId, receiver: userId },
                     { sender: userId, receiver: myId }
                 ]
             }).sort({ createdAt: 1 }).populate('sender', 'username');
        }

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { receiver, text } = req.body;
        const sender = req.user.id;

        if (!receiver || !text || text.trim() === '') {
            return res.status(400).json({ message: 'Invalid data' });
        }

        const message = await Message.create({ sender, receiver, text, type: 'text', status: 'sent' });
        const populatedMessage = await message.populate('sender', 'username');

        const chatUser = await User.findById(receiver);
        if (chatUser && chatUser.isGroup) {
            chatUser.members.forEach(memberId => {
                if (memberId.toString() !== sender.toString()) {
                    req.io.to(memberId.toString()).emit('receive_message', populatedMessage);
                }
            });
        } else {
            req.io.to(receiver).emit('receive_message', populatedMessage);
        }

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Newly injected Multer Receiver Endpoint tracking files perfectly!
export const sendMediaMessage = async (req, res) => {
    try {
        const { receiver, type, duration } = req.body;
        const sender = req.user.id;
        
        if (!receiver || !req.file) return res.status(400).json({ message: 'Invalid media data' });

        const fileUrl = 'uploads/' + req.file.filename;

        const message = await Message.create({
            sender, 
            receiver, 
            type,
            fileUrl,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            duration: duration || 0,
            text: '', // Blank natively bypassing textual limitations
            status: 'sent'
        });

        const populatedMessage = await message.populate('sender', 'username');
        
        const chatUser = await User.findById(receiver);
        if (chatUser && chatUser.isGroup) {
            chatUser.members.forEach(memberId => {
                if (memberId.toString() !== sender.toString()) {
                    req.io.to(memberId.toString()).emit('receive_message', populatedMessage);
                }
            });
        } else {
            req.io.to(receiver).emit('receive_message', populatedMessage);
        }
        
        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error("Multer failure:", error);
        res.status(500).json({ message: error.message });
    }
}

export const updateMessageStatus = async (req, res) => {
    try {
        const { messageIds, status } = req.body;
        
        const updateData = { status };
        if (status === 'delivered') updateData.deliveredAt = new Date();
        if (status === 'read') updateData.readAt = new Date();

        await Message.updateMany(
            { _id: { $in: messageIds }, receiver: req.user.id },
            { $set: updateData }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markAllDelivered = async (req, res) => {
    try {
        const myId = req.user.id;
        const messagesToUpdate = await Message.find({ receiver: myId, status: 'sent' });
        
        if (messagesToUpdate.length > 0) {
            await Message.updateMany(
                { receiver: myId, status: 'sent' },
                { $set: { status: 'delivered', deliveredAt: new Date() } }
            );
            
            const sendersMap = {};
            messagesToUpdate.forEach(m => {
                const s = m.sender.toString();
                if(!sendersMap[s]) sendersMap[s] = [];
                sendersMap[s].push(m._id);
            });
            
            for(const [senderId, messageIds] of Object.entries(sendersMap)) {
                req.io.to(senderId).emit('message_delivered', { messageIds });
            }
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
