const { JWT_SECRET } = require("../config")
const jwt = require("jsonwebtoken")

function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const auth = req.headers.authorization.split(" ")
    const token = auth[1];
    console.log(token);
    try {

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded);
        if (decoded.username) {
            next();
        }

        else {
            res.status(404).json({
                msg: "you are not authenticated"
            })
        }
    }
    catch (e) {

        res.json({
            msg: "error occurred during try block"
        })
    }
}

module.exports = adminMiddleware;