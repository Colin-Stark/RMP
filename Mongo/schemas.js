const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: String,
    isLoggedIn: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: Number,
    },
    otpExpires: {
        type: Date,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;