const { Admin } = require('../db')
// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const { username, password } = req.headers;

    try {
        const adminExists = await Admin.findOne({ username, password });
        if (adminExists) {
            next();
        } else {
            res.status(400).json({ msg: "admin does not exists" });
        }
    }
    catch {
        res.status(400).json({
            msg: "middleware catches an error"
        })
    }
}

module.exports = adminMiddleware;