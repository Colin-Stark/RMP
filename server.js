const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const authCheck = require('./middleware/auth_check');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const userRegister = require('./routes/register');
const userLogin = require('./routes/login');
const userVerification = require('./routes/verification');
const userResendOTP = require('./routes/resend_otp');
const courses = require('./routes/courses');

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
app.use("/login", userLogin);
app.use("/verify", userVerification);
app.use("/resend_otp", userResendOTP);
app.use("/courses", courses);



// Test endpoint
app.get('/', (req, res) => {
    res.send('Test');
});


// Connect to MongoDB and start the server
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log('Connected to MongoDB');

        // Start the server

        const PORT = 8080;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        return 'connected';

    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// Call the connectDB function to establish the MongoDB connection
connectDB();



// Export the Express app as a serverless function
module.exports = app;
