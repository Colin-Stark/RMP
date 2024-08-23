const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../Mongo/schemas');
const nodemailer = require("nodemailer");

const router = express.Router();


// Middleware to validate request
const validateRegisterInput = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Email and Password are required');
        return res.status(400).json('Email and Password are required');
    }

    if (!email.endsWith('@myseneca.ca')) {
        console.log('Email must end with @myseneca.ca');
        return res.status(400).json('Email must end with @myseneca.ca');
    }

    if (password.length < 8 || password.length > 16) {
        console.log('Password must be between 8 and 16 characters');
        return res.status(400).json('Password must be between 8 and 16 characters');
    }

    next();
};

// Function to create a new user
const createNewUser = async (email, password) => {
    const hashedPassword = bcrypt.hashSync(password, 12);
    const newUser = new User({ email, password: hashedPassword });

    return newUser.save();
};

// Function to handle errors
const handleRegisterError = (error, res) => {
    if (error.code === 11000) {
        console.log('Email already exists');
        return res.status(400).json('Email already exists');
    } else {
        console.error('Registration Error:', error);
        return res.status(500).json('Registration Error');
    }
};

/**
 * Functon to Generate OTP
 *  - OTP WILL BE A 6 DIGIT NUMBER
 *  - IT CHECKS THE VALUE OF otpExpires FOR THE USER
 *  - IF IT IS GREATER THAN CURRENT DATE AND TIME, IT WILL RETURN THE SAME OTP
 *  - ELSE, IF IT IS NULL OR LESS THAN CURRENT DATE, IT WILL GENERATE A NEW OTP
 *    THAT EXPIRES IN 30 MINUTES
 *  - IT WILL ALSO UPDATE THE otpExpires VALUE
 */

const generateOTP = async (email) => {
    const user = await User.findOne({ email });

    const now = new Date();
    if (user.otpExpires && user.otpExpires > now) {
        // Return existing OTP if it's still valid
        return user.otp;
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // Convert to integer
    const otpExpires = new Date(now.getTime() + 30 * 60000); // OTP valid for 30 minutes

    // Update user's OTP and expiry time
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    return otp;
};


// Function to send OTP email
const jsonOTPEmail = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.OUTLOOK_EMAIL,
            pass: process.env.APP_PASSWORD,
        },
        connectionTimeout: 1200000,
    });

    let info = await transporter.jsonMail({
        from: '"Rate My Professor" <rirr0@outlook.com>',
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${otp}`, // Plain text body for non-HTML clients
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
            <h2 style="text-align: center; margin: 20px; background-color: #4CAF50; color: #ffffff; display: inline-block; padding: 10px 20px; border-radius: 5px;">Rate My Professor</h2>
            <p>Dear User,</p>
            <p>Thank you for using <strong>Seneca Rate My Professor</strong>. To complete your registration or verification process, please use the following One-Time Password (OTP):</p>
            <div style="text-align: center; margin: 20px;">
                <span style="font-size: 24px; font-weight: bold; background-color: #ff4c4c; color: #ffffff; padding: 10px 20px; border-radius: 5px; display: inline-block;">${otp}</span>
            </div>
            <p style="text-align: center; color: #555;">This OTP is valid for 30 minutes. Please do not share this code with anyone.</p>
            <p>If you did not request this code, please ignore this email or contact our support team immediately.</p>
            <p>Best regards,</p>
            <p><strong>Seneca Rate My Professor Team</strong></p>
            <hr style="border-top: 1px solid #eeeeee; margin-top: 30px;">
            <p style="font-size: 12px; color: #999; text-align: center;">This is an automated message, please do not reply to this email.</p>
        </div>
        `,
    });

    console.log(`Email sent to: , ${info.accepted} with message ID: ${info.messageId}`);

};


// Register page (GET)
router.get('/', (req, res) => {
    res.json('Register Page');
});


// Register (POST)
router.post('/', validateRegisterInput, async (req, res) => {
    const { email, password } = req.body;

    try {
        await createNewUser(email, password);
        const otp = await generateOTP(email);
        await jsonOTPEmail(email, otp);
        console.log('User Created');
        res.json('Registration Successful');
    } catch (error) {
        handleRegisterError(error, res);
    }
});


module.exports = router;