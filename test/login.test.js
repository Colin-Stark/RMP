const express = require('express');
const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { User } = require('../Mongo/schemas'); // Import User model
const app = express();
const loginRouter = require('../routes/login');

app.use(express.json());
app.use('/login', loginRouter);

// Connect to MongoDB
beforeAll(async () => {
    await mongoose.connect(process.env.MONGOOSE_URL);
});

// Clear the database after each test
afterEach(async () => {
    await User.deleteMany({});
});

// Close connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

// Test Suite
describe('Login Routes', () => {
    let mockUser; // To hold the user for tests

    beforeEach(async () => {
        // Create a mock user for testing
        const password = await bcrypt.hash('password123', 10);
        mockUser = new User({
            email: 'test@myseneca.ca',
            password,
        });
        await mockUser.save();
    });

    test('GET /login returns login page', async () => {
        const response = await request(app).get('/login');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Login Page');
    });

    test('POST /login with valid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Login Successful');

        const updatedUser = await User.findById(mockUser._id);
        expect(updatedUser.isLoggedIn).toBe(true);
        expect(updatedUser.lastLogin).toBeInstanceOf(Date);
    });

    test('POST /login with invalid email', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'wrong@example.com', password: 'password123' });

        expect(response.status).toBe(404); // Adjust according to your error handling
        expect(response.text).toBe('User not found'); // Customize based on your actual response
    });

    test('POST /login with invalid password', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.text).toBe('Invalid Password');
    });

    test('POST /login with missing fields', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'test@example.com' }); // Missing password

        expect(response.status).toBe(400);
        expect(response.text).toBe('Email and Password are required');
    });
});
