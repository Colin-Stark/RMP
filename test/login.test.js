const axios = require('axios'); // Use axios for direct HTTP requests
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { User } = require('../Mongo/schemas');

const BASE_URL = process.env.BASE_URL + '/login';

// Connect to MongoDB
beforeAll(async () => {
    await mongoose.connect(process.env.MONGOOSE_URL);
});

// Clear the database after each test
afterEach(async () => {
    await User.deleteOne({
        email: 'test@myseneca.ca'
    });
});

// Close connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

// Test Suite
describe('Login Routes', () => {
    let mockUser;

    beforeEach(async () => {
        const password = await bcrypt.hash('password123', 10);
        mockUser = new User({
            email: 'test@myseneca.ca',
            password,
        });
        await mockUser.save();
    });

    test('GET /login returns login page', async () => {
        const response = await axios.get(`${BASE_URL}`);
        expect(response.status).toBe(200);
        expect(response.data).toBe('Login Page');
    });

    test('POST /login with valid credentials', async () => {
        const response = await axios.post(`${BASE_URL}`, {
            email: 'test@myseneca.ca',
            password: 'password123',
        });

        expect(response.status).toBe(200);
        expect(response.data).toBe('Login Successful');
    });

    test('POST /login with invalid email', async () => {
        try {
            await axios.post(`${BASE_URL}`, {
                email: 'wrong@example.com',
                password: 'password123',
            });
        } catch (error) {
            expect(error.response.status).toBe(401); // Expect a 401 status
            expect(error.response.data).toBe('User not found'); // Expect the response message
        }
    });

    test('POST /login with invalid password', async () => {
        try {
            await axios.post(`${BASE_URL}`, {
                email: 'test@myseneca.ca',
                password: 'wrongpassword',
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
            expect(error.response.data).toBe('Invalid Password');
        }
    });

    test('POST /login with missing fields', async () => {
        try {
            await axios.post(`${BASE_URL}`, {
                email: 'test@myseneca.ca', // Missing password
            });
        }
        catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toBe('Email and Password are required');
        }
    });
});
