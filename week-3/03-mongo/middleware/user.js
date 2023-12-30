const { User } = require("../db")

async function userMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const { username, password } = req.headers;
    try {
        const userExists = await User.findOne({ username, password });
        if (userExists) {
            next();
        } else {
            res.status(400).json({ msg: "user does not exists" });
        }
    }
    catch {
        res.status(400).json({
            msg: "middleware catches an error"
        })
    }
}

module.exports = userMiddleware;