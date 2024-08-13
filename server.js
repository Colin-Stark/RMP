const express = require('express');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./Mongo/schemas'); // Adjust the path if necessary
const authCheck = require('./middleware/auth_check');

const app = express();

// Middleware
app.use(express.json());
app.use(authCheck);

// Test endpoint
app.get('/', (req, res) => {
    res.send('Test');
});

// Register page (GET)
app.get('/register', (req, res) => {
    res.send('Register Page');
});

// Register (POST)
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).send('User created');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Connect to MongoDB and start the server
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Call the connectDB function to establish the MongoDB connection
connectDB();

// Export the Express app as a serverless function
module.exports = app;
