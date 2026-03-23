import Chat from '../models/Chat.js';

export const accessChat = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "UserId param not sent with request" });
    }

    try {
        let isChat = await Chat.find({
            $and: [
                { participants: { $elemMatch: { $eq: req.user._id } } },
                { participants: { $elemMatch: { $eq: userId } } },
            ]
        }).populate("participants", "-password");

        if (isChat.length > 0) {
            res.status(200).send(isChat[0]);
        } else {
            var chatData = {
                participants: [req.user._id, userId],
            };
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("participants", "-password");
            res.status(200).send(FullChat);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const fetchChats = async (req, res) => {
    try {
        const results = await Chat.find({ participants: { $elemMatch: { $eq: req.user._id } } })
            .populate("participants", "-password")
            .sort({ updatedAt: -1 });
        res.status(200).send(results);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
