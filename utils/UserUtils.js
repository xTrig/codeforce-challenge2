const bcrypt = require('bcrypt');
const app = require('../app');
const saltRounds = process.env.SALT_ROUNDS;

module.exports.createUser = (pool, firstName, lastName, email, password, callback) => {
    //First we need to hash the password
    bcrypt.hash(password, saltRounds, (err, encryptedPass) => { //This function is async, since it will take a while to execute.
        //Once the password has finished hasing, the above function is called.
        if(err) throw err; //If there was an error, we should print it and shutdown the server
        const sql = "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)";
        pool.query(sql, [firstName, lastName, email, encryptedPass], (err, res) => {
            if(err) throw err;
            callback(res); //Once we have finished creating the user, return the object
        });
    });
}

module.exports.verifyLogin = (pool, email, password, callback) => {
    let sql = "SELECT * FROM users WHERE email=?";
    pool.query(sql, [email], (err, res) => {
        if(err) throw err;
        if(res.length > 0) { //If we found a user with this email
            let user = res[0];
            bcrypt.compare(password, user.password, (err, validPass) => {
                if(validPass) {
                    callback(user); //Return the user object
                } else {
                    callback(false); //The password is invalid
                }
            });
        } else {
            callback(false); //We didn't find a user with this email
        }
    });
}

module.exports.getUserById = (pool, id, callback) => {
    let sql = "SELECT * FROM users WHERE id=?";
    pool.query(sql, [id], (err, res) => {
        if(err) throw err;
        if(res.length > 0) {
            callback(res[0]);
        } else {
            callback(false);
        }
    });
}