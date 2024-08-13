const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');

const User = require('./Mongo/schemas');

/**
 * SET AN APP LOCAL VARIABLE TO TELL THAT A DEFAULT USER HAS BEEN CREATED 
 * IT SHOULD BE TRUE OR FALSE
 */
app.locals.defaultUserCreated = false;


/**
 * Connect to MongoDB
 * use a try catch block to handle any errors
 */

console.log(process.env.MONGOOSE_URL);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log('Connected to MongoDB');
        // .then(
        // /**
        //  * Add a user to the database
        //  * the email is owner@myseneca.ca
        //  * The Password is Collins is a developer
        //  * The isverified field should be true
        //  */
        // async () => {
        //     if (app.locals.defaultUserCreated) {
        //         return;
        //     }
        //     const user = await User.findOne({ email: process.env.DEFAULT_USER_EMAIL });
        //     if (user) {
        //         console.log('Default user already exists');
        //         return;
        //     }
        //     const hashedPassword = await bcrypt.hash(process.env.DEFAULTPASSWORD, 10);
        //     const newUser = new User({
        //         firstName: 'ADMIN',
        //         lastName: 'USER',
        //         email: process.env.DEFAULTEMAIL,
        //         password: hashedPassword,
        //         isVerified: true,
        //     });
        //     await newUser.save()
        //         .then(() => {
        //             console.log('Default user created');
        //             app.locals.defaultUserCreated = true;
        //         })
        //         .catch(err => console.log(err));
        // }
        // )
        // .catch(
        // err => console.log(err)
        //);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};


/** 
 * Listen to the server
*/
const PORT = process.env.PORT_CONNECTION;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
