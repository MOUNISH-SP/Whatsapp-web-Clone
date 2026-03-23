import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { validationResult } from 'express-validator';
import twilio from 'twilio';

// Load Twilio Config from Environment
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

let twilioClient;
// Only initialize Twilio if all required credentials are provided
if (accountSid && authToken && verifyServiceSid) {
    twilioClient = twilio(accountSid, authToken);
}

export const sendOtp = async (req, res) => {
    // Input validation Check
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { phoneNumber } = req.body;

    // 1. Safe Mock Development Fallback (Triggered by USE_MOCK_OTP=true)
    if (process.env.USE_MOCK_OTP === 'true') {
        console.log(`\n=========================================`);
        console.log(`[MOCK MODE] OTP Request for: ${phoneNumber}`);
        console.log(`[MOCK MODE] Use Mock OTP: 123456 to login.`);
        console.log(`=========================================\n`);
        return res.status(200).json({ message: 'Development mode active: Use mock OTP 123456' });
    }

    // 2. Live Provider: Twilio Verify
    if (twilioClient) {
        try {
            await twilioClient.verify.v2.services(verifyServiceSid)
                .verifications.create({ to: phoneNumber, channel: 'sms' });
            
            console.log(`[Twilio Verify] Sent OTP securely to ${phoneNumber}`);
            return res.status(200).json({ message: 'OTP sent successfully via Twilio.' });
        } catch (error) {
            console.error("Twilio Verification Error:", error.message || error);
            return res.status(500).json({ 
                // Return exact real provider error to the frontend for debugging
                message: error.message || 'Failed to send OTP via Twilio. Ensure numbers are valid and pre-verified if using a trial.' 
            });
        }
    } 

    // 3. Fallback Error
    console.error("OTP Failed: No provider configured and USE_MOCK_OTP is false.");
    return res.status(500).json({ message: 'Server Configuration Error: No OTP provider is configured and mock mode is strictly disabled.' });
};

export const verifyOtp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { phoneNumber, otp, name } = req.body;
    let isVerified = false;

    // 1. Mock Check
    if (process.env.USE_MOCK_OTP === 'true') {
        if (otp === '123456') {
            isVerified = true;
            console.log(`[MOCK MODE] OTP 123456 verified successfully for ${phoneNumber}`);
        } else {
             return res.status(401).json({ message: 'Invalid Mock OTP. Use 123456 in active Development Mode.' });
        }
    } 
    // 2. Live Provider Check
    else if (twilioClient) {
        try {
             const verificationCheck = await twilioClient.verify.v2.services(verifyServiceSid)
                .verificationChecks.create({ to: phoneNumber, code: otp });
             
             if (verificationCheck.status === 'approved') {
                 isVerified = true;
             } else {
                 return res.status(401).json({ message: 'Invalid or expired OTP code.' });
             }
        } catch (error) {
            console.error("Twilio Check Error:", error.message || error);
            return res.status(500).json({ message: error.message || 'Validation failed reaching out to Twilio API.' });
        }
    } else {
        return res.status(500).json({ message: 'Server Configuration Error: No OTP provider is configured and mock mode is strictly disabled.' });
    }

    // 3. Processing the authenticated user identity
    if (isVerified) {
        let user = await User.findOne({ phoneNumber });
        if (!user) {
            user = await User.create({
                phoneNumber,
                name: name || "EchoChat User"
            });
            console.log(`[Auth] Created new user: ${phoneNumber}`);
        } else {
            console.log(`[Auth] Logged in existing user: ${phoneNumber}`);
        }

        res.json({
            _id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            avatar: user.avatar,
            about: user.about,
            token: generateToken(user._id),
        });
    }
};

export const getMe = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'Session invalid or user deleted.' });
    }
};
