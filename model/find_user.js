const User = require('../Mongo/schemas');

// Function to check if user exists
const checkUserExists = async (email, res) => {
    const user = await User.findOne({ email });
    if (!user) {
        console.log(`User with the email: ${email} not found`);
        res.status(404).send('User not found');
        return null;
    }
    return user;
};

// Middleware to validate user and check if exists
const validateUserExists = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        console.log('Email is required');
        return res.status(400).send('Email is required');
    }

    const user = await checkUserExists(email, res);
    if (!user) return; // If user not found, stop request

    // Attach the user object to the request object so that it can be accessed later in the route
    req.user = user;
    next();
};

module.exports = { checkUserExists, validateUserExists };