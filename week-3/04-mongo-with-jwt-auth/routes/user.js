const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const { JWT_SECRET } = require("../config")
const jwt = require('jsonwebtoken')
// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const { username, password } = req.body;

    try {

        const userExists = await User.findOne({ username });

        if (!userExists) {

            await User.create({
                username,
                password
            });

            res.status(200).json({
                msg: "user created successfully"
            });

        } else {

            res.status(400).json({
                msg: "user already exist"
            })
        }
    }
    catch (error) {

        console.error("error while creating user ", error);
        res.status(500).json({
            msg: "Internal server error"
        })
    }
});

router.post('/signin', async (req, res) => {
    // Implement User signup logic
    const { username, password } = req.body;

    try {

        const isValid = await User.find({ username, password });

        if (isValid) {

            const token = jwt.sign({ username }, JWT_SECRET);
            res.json({ token: token })

        }

        else {
            res.status(411).json({
                msg: "Incorrect email and password"
            })
        }

    }
    catch (e) {

        res.json({ msg: "error in try block" })
        console.error(e);

    }
});

router.get('/courses', async (req, res) => {

    const auth = req.headers.authorization.split(" ")
    const token = auth[1];

    try {

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded);
        if (decoded.username) {
            const allCourse = await Course.find({});
            res.json({ courses: allCourse });
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
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    const courseId = req.params.courseId;
    console.log(courseId);
    try {
        await User.updateOne({ username: req.decodedUsername }, { "$push": { purchasedCourses: courseId } })
        const updatedUser = await User.findOne({ username: req.decodedUsername })
        res.json({ msg: "purchase successful", user: updatedUser })
    }
    catch (e) {
        res.json({ msg: "error occurred in try block of user/courses/:coursesId" })
    }
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const response = await User.findOne({ username: req.decodedUsername })
    const course = await Course.find({ _id: { "$in": response.purchasedCourses } })
    res.json({ purchased: course })
});

module.exports = router