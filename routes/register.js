const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../Mongo/schemas');
const { generateOTP, sendOTPEmail } = require('../model/otp_logic');

const router = express.Router();


// Middleware to validate request
const validateRegisterInput = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Email and Password are required');
        return res.status(400).send('Email and Password are required');
    }

    if (!email.endsWith('@myseneca.ca')) {
        console.log('Email must end with @myseneca.ca');
        return res.status(400).send('Email must end with @myseneca.ca');
    }

    if (password.length < 8 || password.length > 16) {
        console.log('Password must be between 8 and 16 characters');
        return res.status(400).send('Password must be between 8 and 16 characters');
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
        return res.status(400).send('Email already exists');
    } else {
        console.error('Registration Error:', error);
        return res.status(500).send('Registration Error');
    }
};

// Register page (GET)
router.get('/', (req, res) => {
    res.send('Register Page');
});


// Register (POST)
router.post('/', validateRegisterInput, async (req, res) => {

    const { email, password } = req.body;

    try {
        await createNewUser(email, password);
        const otp = await generateOTP(email);
        await sendOTPEmail(email, otp);
        console.log('User Created');
        res.send('Registration Successful');
    } catch (error) {
        handleRegisterError(error, res);
    }
});


module.exports = router;