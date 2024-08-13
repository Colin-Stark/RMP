const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('./Mongo/schemas');
const authCheck = require('./middleware/auth_check');

app.use(express.json());
app.use(authCheck);


/**
 * SET AN APP LOCAL VARIABLE TO TELL THAT A DEFAULT USER HAS BEEN CREATED 
 * IT SHOULD BE TRUE OR FALSE
 */
app.locals.defaultUserCreated = false;

/**
 * Endpoint to test the middleware
 */
app.get('/', (req, res) => {
    res.send('Test');
});


/**
 * Create a get endpoint
 * for the register page
 * it should return a form
 */
app.get('/register', (req, res) => {
    res.send('Register Page');
});

/**
 * Create a register endpoint
 * it would just collect email
 * and password for now from the
 * request body
 */
app.post('/register', async (req, res) => {
    /** Array Destructuring */
    const { email, password } = req.body;
    try {
        /** Query to find user */
        const user = await User.findOne({
            email,
        });

        /** If the user exists, do not create another one again */
        if (user) {
            return res.status(400).send('User already exists');
        }

        /** if the user does not exist, Hash the password */
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).send('User created');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


/**
 * Connect to MongoDB
 * use a try catch block to handle any errors
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};


/** 
 * Listen to the server
*/
const PORT = process.env.PORT_CONNECTION;

connectDB();

module.exports = app();