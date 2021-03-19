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