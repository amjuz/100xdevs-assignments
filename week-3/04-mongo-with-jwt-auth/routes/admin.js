const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, Course } = require("../db")
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../config")
// Admin Routes
router.post('/signup', async (req, res) => {

    const { username, password } = req.body;

    try {

        const adminExists = await Admin.findOne({ username });

        if (!adminExists) {

            await Admin.create({
                username,
                password
            });

            res.status(200).json({
                msg: "Admin created successfully"
            });

        } else {

            res.status(400).json({
                msg: "Admin already exist"
            })
        }
    }
    catch (error) {

        console.error("error while creating admin ", error);
        res.status(500).json({
            msg: "Internal server error"
        })
    }
})
router.post('/signin', async (req, res) => {

    const { username, password } = req.body;

    try {

        const isValid = await Admin.find({ username, password });

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

router.post('/courses', adminMiddleware, async (req, res) => {

    const { title, description, price, imageLink } = req.body;

    const createCourse = await Course.create({
        title,
        description,
        price,
        imageLink
    })
    res.status(200).json({
        msg: "course created successfully",
        id: createCourse._id
    })

});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const respond = await Course.find({});
    res.status(200).json({
        course: respond,
    })
});

module.exports = router;