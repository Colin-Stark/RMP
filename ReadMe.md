# Express Server Documentation

This repository contains an Express server with user authentication features, such as registration, login, OTP verification, and OTP resending. Below is the documentation for the API endpoints.

➡️ [API Documentation Page](https://colin-stark.github.io/RMP/)

### Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [GET /](#get-)
  - [POST /register](#post-register)
  - [POST /login](#post-login)
  - [POST /verify](#post-verify)
  - [POST /resend_otp](#post-resend_otp)

---

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```plaintext
   MONGOOSE_URL=your_mongodb_connection_string
   ```

4. Run the server:

   ```bash
   npm start
   ```

---

### Usage

This API allows users to register, log in, verify their account using OTP, and resend OTPs. The server uses MongoDB for storage, Helmet for security, and CORS is enabled for all origins.

---

### Environment Variables

| Variable       | Description               |
| -------------- | ------------------------- |
| `MONGOOSE_URL` | MongoDB connection string |

---

### API Endpoints

#### **GET /**

**Description**: A simple test endpoint to check if the server is running.

- **URL**: `/`
- **Method**: `GET`
- **Response**:
  - Status: 200 OK
  - Body: `"Test"`

#### **POST /register**

**Description**: Register a new user.

- **URL**: `/register`
- **Method**: `POST`
- **Request Body**:
  - `email`: string, required (must end with `@myseneca.ca`)
  - `password`: string, required (must be between 8 and 16 characters)
- **Response**:
  - Success: `"Registration Successful"`
  - Failure:
    - 400 Bad Request (if email or password is invalid)
    - 500 Internal Server Error

#### **POST /login**

**Description**: Log in a user.

- **URL**: `/login`
- **Method**: `POST`
- **Request Body**:
  - `email`: string, required
  - `password`: string, required
- **Response**:
  - Success: `"Login Successful"`
  - Failure:
    - 400 Bad Request (if email or password is missing)
    - 401 Unauthorized (if password is incorrect)
    - 500 Internal Server Error

#### **POST /verify**

**Description**: Verify the user's account using OTP.

- **URL**: `/verify`
- **Method**: `POST`
- **Request Body**:
  - `email`: string, required
  - `otp`: string, required
- **Response**:
  - Success: `"Verification Successful"`
  - Failure:
    - 400 Bad Request (if email or OTP is invalid)
    - 500 Internal Server Error

#### **POST /resend_otp**

**Description**: Resend OTP to the user's email.

- **URL**: `/resend_otp`
- **Method**: `POST`
- **Request Body**:
  - `email`: string, required
- **Response**:
  - Success: `"OTP resent to: <email>"`
  - Failure:
    - 400 Bad Request (if email is missing)
    - 500 Internal Server Error

---

### Middleware

- **`authCheck`**: This middleware is applied to all routes and can be used to validate authentication before accessing the endpoints.
- **Validation Middleware**: Each endpoint has specific validation middlewares to ensure correct input data.
