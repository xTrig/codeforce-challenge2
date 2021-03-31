const express = require('express');
const router = express.Router();
const server = require('../app');
const requireAuth = require('../middleware/requireAuth');
const courseUtils = require('../utils/CourseUtils');

router.get('/:courseId', requireAuth, (req, res) => {
    const courseId = req.params.courseId;

    if(courseId) { //Not sure if this is 100% required, but better to be safe than sorry
        courseUtils.isMemberOfClass(server.pool, req.user.id, courseId, (isMember) => {
            if(isMember) {
                res.render('chat', {courseId});
            } else {
                res.render('401');
            }
        });
    } else {
        res.send("Invalid course Id");
    }
});

module.exports = router;