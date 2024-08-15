const express = require('express');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./Mongo/schemas');
const authCheck = require('./middleware/auth_check');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authCheck);
app.use(helmet());

// Test endpoint
app.get('/', (req, res) => {
    res.send('Test');
});

// Register page (GET)
app.get('/register', (req, res) => {
    res.send('Register Page');
});

// Register (POST)
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    /** Email and Password must exist */
    if (!email || !password) {
        console.log('Email and Password are required');
        return res.status(400).send('Email and Password are required');
    }

    /**
     * Email has to end with @myseneca.ca
     */
    if (!email.endsWith('@myseneca.ca')) {
        console.log('Email must end with @myseneca.ca');
        return res.status(400).send('Email must end with @myseneca.ca');
    }

    /**
     * CHECK THAT PASSWORD IS AT LEAST 8 CHARACTERS LONG 
     * AND NOT MORE THAN 16 CHARACTERS LONG
     */
    if (password.length < 8 || password.length > 16) {
        console.log('Password must be between 8 and 16 characters');
        return res.status(400).send('Password must be between 8 and 16 characters');
    }



    /** Create a new User */
    const newUser = new User({
        email,
        password: bcrypt.hashSync(password, 10),
    });

    newUser.save()
        .then(() => {
            console.log('User Created');
            res.send('Registration Successful');
        })
        .catch((error) => {

            if (error.code === 11000) {
                return res.status(400).send('Email already exists');
            }
            else {
                console.error('Registration Error:', error);
            }
            return res.status(500).send('Registration Error');
        });
});


// Connect to MongoDB and start the server
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Call the connectDB function to establish the MongoDB connection
connectDB();

// Start the server
// const PORT = 8080;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// Export the Express app as a serverless function
module.exports = app;
