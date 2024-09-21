const express = require('express');
const User = require('../Mongo/schemas');
const router = express.Router();

// Middleware to validate request
const validateOTPInput = (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        console.log('Email and OTP are required');
        return res.status(400).send('Email and OTP are required');
    }

    next();
};

// Verify OTP (GET)
router.get('/', (req, res) => {
    res.send('Verify OTP Page');
});

// Verify OTP (POST)
router.post('/', validateOTPInput, async (req, res) => {
    const { email, otp } = req.body;

    try {

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User with the email: ${email} not found`);
            return res.status(404).send('User not found');
        }

        // check that otpExpires is greater than current date and time
        if (user.otpExpires < Date.now()) {
            console.log('OTP has expired');
            return res.status(400).send('OTP has expired');
        }

        // check that the OTP is correct
        if (user.otp !== otp) {
            console.log('Invalid OTP');
            return res.status(401).send('Invalid OTP');
        }

        // update isVerified to true
        user.isVerified = true;
        await user.save();
        console.log(`${email} has been verified`);
        return res.send('Verification Successful');
    }
    catch (error) {
        console.error('Verification Error:', error);
        return res.status(500).send('Verification Error');
    }
});

module.exports = router;