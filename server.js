const express = require('express');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const mongoose = require('mongoose');
const authCheck = require('./middleware/auth_check');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const userRegister = require('./routes/register');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authCheck);

app.use(helmet());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

// Routes
app.use("/register", userRegister);

// Test endpoint
app.get('/', (req, res) => {
    res.send('Test');
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
