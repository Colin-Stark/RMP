const express = require('express');
const { CourseCatalog } = require('../Mongo/schemas');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const courses = await CourseCatalog.find(
            {
            },
            { _id: 0, semester: 1, courses: 1 }
        );
        return res.send(courses);
    }
    catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Error');
    }
});

module.exports = router;