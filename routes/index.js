const express = require('express');
const router = express.Router();
const courseUtils = require('../utils/CourseUtils');
const server = require('../app');
const requireAuth = require('../middleware/requireAuth');


router.get('/', requireAuth, (req, res) => {
    //get courses for this user
    courseUtils.getClassesForUser(server.pool, req.user.id, (courses) => {
        res.render('home', {courses});
    });
});
module.exports = router;