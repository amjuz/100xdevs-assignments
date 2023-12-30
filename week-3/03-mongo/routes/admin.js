const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin } = require("../db")
const { Course } = require("../db")
// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
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

});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const { title, description, imageLink, price } = req.body;

    try {
        const courseExists = await Course.findOne({
            title,
            description,
            imageLink,
            price
        });

        if (!courseExists) {

            const courseCreated = await Course.create({
                title,
                description,
                imageLink,
                price
            });
            res.json({
                msg: "Course created successfully",
                courseId: courseCreated._id
            });
        } else {
            res.status(400).json({
                msg: "course already exists"
            })
        }
    }
    catch {
        res.status(400).json({
            msg: "error occurred while creating course"
        })
    }
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const allCourses = await Course.find({});
    res.json({ course: allCourses })

});

module.exports = router;