const express = require('express'); //Import the express module
const handlebars = require('express-handlebars')({
    defaultLayout: "main"
});
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
app.engine('handlebars', handlebars);
app.set('view engine', 'handlebars');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

require('./chat/chatroom')(io);

app.use('/login', require('./routes/login'));
module.exports.pool = pool; //Make the connection pool global

server.listen(PORT, () => {
    console.log("Server started on localhost:" + PORT);

});