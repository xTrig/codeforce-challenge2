const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    req.logout();
    req.flash("success", "You have been logged out!");
    setTimeout(() => {
        res.redirect('/login');
    }, 100);
});

module.exports = router;