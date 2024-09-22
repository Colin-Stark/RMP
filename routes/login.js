const express = require('express');
const bcrypt = require('bcryptjs');
const { validateUserExists } = require('../model/find_user');

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
router.post('/', validateLogInInput, validateUserExists, async (req, res) => {
    const { email, password } = req.body;
    const user = req.user;

    try {
        // check that the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid Password');
            return res.status(401).send('Invalid Password');
        }

        // update isLoggedIn to true
        user.isLoggedIn = true;

        // set lastLogin to current date and time
        user.lastLogin = new Date();

        await user.save();

        console.log(`${email} has Logged in Successful at ${user.lastLogin}`);
        return res.send('Login Successful');
    }
    catch (error) {
        console.error('Login Error:', error);
        return res.status(500).send('Login Error');
    }

});

module.exports = router;