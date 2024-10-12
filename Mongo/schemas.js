const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        default: '',
    },
    lastName: {
        type: String,
        default: '',
    },
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
    profileImage: {
        type: String,
        default: '',
    },
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
        default: null
    },
    otpExpires: {
        type: Date,
        default: null,
    },
    lastLogin: {
        type: Date,
        default: null,
    }
});

// Course Schema
const courseSchema = new Schema({
    courseCode: {
        type: String,
        required: true,
    },
    courseName: {
        type: String,
        required: true,
    },
});

// Semester Schema
const semesterSchema = new Schema({
    semester: {
        type: Number,
        required: true,
    },
    courses: [courseSchema], // Array of courses
});

// Course Catalog Schema
const courseCatalogSchema = new Schema({
    semesters: [semesterSchema], // Array of semesters
});

const User = mongoose.model('User', userSchema);
const CourseCatalog = mongoose.model('CourseCatalog', courseCatalogSchema);

module.exports = {
    User,
    CourseCatalog,
};