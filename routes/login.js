const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
    if(!req.isAuthenticated()) {
        res.render('login');
    } else { //The user is already logged in
        res.redirect('/');
    }
});

router.post('/', passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => { //Will handle the login request
    if(req.body.rememberme) { //If the remember me box was checked
        req.session.cookie.expires = false; //Make the cookie never expire
    } else {
        req.session.cookie.originalMaxAge = (60 * 60 * 24) * 1000; //One day
    }

    res.redirect('/'); //redirect them to the homepage
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash("success", "You have been logged out!");
    setTimeout(() => {
        res.redirect('/login');
    }, 100);
});
module.exports = router;