const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db")
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
                msg: "User created successfully"
            });

        } else {

            res.status(400).json({
                msg: "User already exist"
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

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const response = await Course.find({});
    res.status(200).json({ courses: response });

});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const username = req.headers.username;
    const courseId = req.params.courseId;
    await User.updateOne({ username: username }, { "$push": { purchasedCourses: courseId } })
    res.status(200).json({ msg: "purchase successful" });



});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const { username } = req.headers
    const user = await User.findOne({ username })
    const course = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    });
    res.status(200).json({ purchasedCourses: course })
});

module.exports = router