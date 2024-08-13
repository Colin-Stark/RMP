const express = require('express');
const app = express();



async function authCheck(req, res, next) {
    if (req.path === "/login" || req.path === "/register") {
        return next();
    }
    else {
        if (req.body.email) {
            const userDetail = await User.findOne({ email: req.body.email })
                .exec()
                .then((userDetail) => {
                    if (userDetail.isLoggedIn === true) {
                        req.user = userDetail;
                        next();
                    }
                    else {
                        console.log("User is not logged in");
                        res.redirect("/register");

                    }
                })
                .catch((error) => {
                    res.status(500).send("Internal Server Error");
                });
        }
        else {
            res.redirect("/register");
        }
    }
}

module.exports = authCheck;