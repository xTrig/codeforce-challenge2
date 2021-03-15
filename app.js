const express = require('express'); //Import the express module
require('dotenv').config(); //Load env variables
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA
});

const PORT = process.env.PORT || 3000; //Will listen on the specified port, or 3000 by default

const app = express(); //Create the express app
const server = require('http').createServer(app);
const io = require('socket.io')(server);



server.listen(PORT, () => {
    console.log("Server started on localhost:" + PORT)
});


module.exports.pool = pool; //Make the connection pool global