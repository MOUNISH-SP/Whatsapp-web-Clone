import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) return res.status(400).json({ message: "Username and password required" });

        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ username, password: hashedPassword });
        
        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                username: user.username,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({
            $or: [
                { isGroup: { $ne: true }, _id: { $ne: req.user.id } },
                { isGroup: true, members: req.user.id }
            ]
        }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createGroup = async (req, res) => {
    try {
        const { groupName, members } = req.body;
        if(!groupName || !members || members.length === 0) return res.status(400).json({ message: "Name and members required" });

        const allMembers = [...new Set([...members, req.user.id])];

        const group = await User.create({
            username: groupName,
            isGroup: true,
            groupAdmin: req.user.id,
            members: allMembers
        });

        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { theme, about } = req.body;
        
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ message: "User not found" });

        if(theme) user.theme = theme;
        if(about) user.about = about;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
