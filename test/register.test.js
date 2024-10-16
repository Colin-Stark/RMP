const axios = require('axios');
require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('../Mongo/schemas');

const BASE_URL = process.env.BASE_URL + '/register';

beforeAll(async () => {
    await mongoose.connect(process.env.MONGOOSE_URL);
});

afterEach(async () => {
    await User.deleteOne({ email: 'colokpedje@myseneca.ca' });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Test For Registration Route', () => {
    test('GET /register returns register page', async () => {
        const response = await axios.get(BASE_URL);
        expect(response.status).toBe(200);
        expect(response.data).toBe('Register Page');
    });

    test('POST /register with valid email and password but passwrod in numbers not string', async () => {

        try {
            const response = await axios.post(BASE_URL, {
                email: 'colokpedje@myseneca.ca',
                password: 12345678,
            });
        }
        catch (error) {
            expect(error.response.status).toBe(500);
            expect(error.response.data).toBe('Registration Error');
        }
    });

    test('POST /register with valid credentials', async () => {
        const response = await axios.post(BASE_URL, {
            email: 'colokpedje@myseneca.ca',
            password: '12345678',
        });

        expect(response.status).toBe(200);
        expect(response.data).toBe('Registration Successful');

        // Check if user is created in the database
        const user = await User.findOne({ email: 'colokpedje@myseneca.ca' });
        expect(user).toBeTruthy();
        expect(user.email).toBe('colokpedje@myseneca.ca');
    });

    test('POST /register with missing email', async () => {
        try {
            await axios.post(BASE_URL,
                { password: '12345678' },
            );
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toBe('Email and Password are required');
        }
    });

    test('POST /register with missing password', async () => {
        try {
            await axios.post(BASE_URL, { email: 'colokpedje@myseneca.ca' },);
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toBe('Email and Password are required');
        }
    });

    test('POST /register with missing email and password', async () => {
        try {
            await axios.post(BASE_URL, {});
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toBe('Email and Password are required');
        }
    });

    test('POST /register with existing email', async () => {
        await axios.post(BASE_URL, {
            email: 'colokpedje@myseneca.ca',
            password: '12345678',
        });

        try {
            await axios.post(BASE_URL, {
                email: 'colokpedje@myseneca.ca',
                password: 'newpassword',
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toBe('Email already exists');
        }
    });

    test('POST /register with invalid email', async () => {
        try {
            await axios.post(BASE_URL, {
                email: 'wrong@gmail.com',
                password: '12345678',
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toBe('Email must end with @myseneca.ca');
        }
    });

    test('POST /register with invalid password', async () => {
        try {
            await axios.post(BASE_URL, {
                email: 'colokpedje@myseneca.ca',
                password: '123',
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toBe('Password must be between 8 and 16 characters');
        }
    });

    test('POST /register with invalid email and password', async () => {
        try {
            await axios.post(BASE_URL, {
                email: 'bad@gmail.com',
                password: '123',
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toBe('Email must end with @myseneca.ca');
        }
    });

    test('POST /register with invalid password and existing email', async () => {
        await axios.post(BASE_URL, {
            email: 'colokpedje@myseneca.ca',
            password: '12345678',
        });

        try {
            await axios.post(BASE_URL, {
                email: 'colokpedje@myseneca.ca',
                password: '123', // Invalid password
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toBe('Password must be between 8 and 16 characters');
            expect(error.response.data).not.toBe('Email already exists');
        }
    });
});