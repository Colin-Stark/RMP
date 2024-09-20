const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../Mongo/schemas');

const router = express.Router();

// Middleware to validate request
const validateLogInInput = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Email and Password are required');
        return res.status(400).send('Email and Password are required');
    }

    next();

};

// Login (GET)
router.get('/', (req, res) => {
    res.send('Login Page');
});

// Login (POST)
router.post('/', validateLogInInput, async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User with the email: ${email} not found`);
            return res.status(404).send('User not found');
        }

        // check that the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid Password');
            return res.status(401).send('Invalid Password');
        }

        console.log(`${email} has Logged in Successful`);
        res.send('Login Successful');
    }
    catch (error) {
        console.error('Login Error:', error);
        return res.status(500).send('Login Error');
    }

});

module.exports = router;