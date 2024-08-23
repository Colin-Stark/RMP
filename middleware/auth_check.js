const User = require('../Mongo/schemas'); // Adjust the path if necessary

async function authCheck(req, res, next) {
    try {
        // Allow requests to pass through for login and register routes
        if (req.path === "/login" || req.path === "/register") {
            return next();
        }

        // Check if the request contains an email in the body
        if (req.body.email) {
            const userDetail = await User.findOne({ email: req.body.email });

            if (userDetail && userDetail.isLoggedIn) {
                // Attach user details to the request object and proceed
                req.user = userDetail;
                return next();
            } else {
                console.log("User is not logged in or does not exist");
                return res.redirect("/register");
            }
        } else {
            // Redirect if email is not provided
            console.log("Email is missing in the request");
            return res.redirect("/register");
        }
    } catch (error) {
        // Handle errors in a catch block
        console.error("Internal Server Error:", error);
        return res.status(500).send("Internal Server Error");
    }
}

module.exports = authCheck;
