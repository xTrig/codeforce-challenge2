const LocalStrategy = require('passport-local').Strategy;
const userUtils = require('../utils/UserUtils');

module.exports = (passport, pool) => {
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, (email, password, done) => {
        userUtils.verifyLogin(pool, email, password, (user) => {
            if(user) {
                done(null, user); //The login was a success, pass the user to passport to create a session
            } else {
                done(null, false, {message: "Invalid email and password combination"});
            }
        });
    }));


    //**********Automatic passport magic to handle sessions */
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        userUtils.getUserById(pool, id, (user) => {
            if(user) {
                done(null, user);
            } else {
                console.log("Could not deserialize user with ID " + id);
            }
        });
    });
}