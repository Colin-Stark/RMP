const express = require('express');
const { validateUserExists } = require('../model/find_user');
const { generateOTP, sendOTPEmail } = require('../model/otp_logic');

const router = express.Router();

// Middleware to validate request
const validateResendOTPInput = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        console.log('Email is required');
        return res.status(400).send('Email is required');
    }

    next();

};

// Resend OTP (GET)
router.get('/', (req, res) => {
    res.send('Resend OTP Page');
});

// Resend OTP (POST)
router.post('/', validateResendOTPInput, validateUserExists, async (req, res) => {
    const { email } = req.body;
    const user = req.user;

    try {

        const otp = await generateOTP(email);
        await sendOTPEmail(email, otp);

        console.log(`OTP sent to: ${email}`);
        return res.send(`OTP resent to: ${email}`);

    } catch (error) {
        console.error('Resend OTP Error:', error);
        return res.status(500).send('Resend OTP Error');
    }

});

module.exports = router;