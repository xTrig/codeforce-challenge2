const server = require('../app');
const chatUtils = require('../utils/ChatUtils');
const userUtils = require('../utils/UserUtils');
module.exports = (io) => {
    console.log("Setting up Socket.IO server...");
    io.use((socket, next) => {
        const username = socket.handshake.auth.username;
        const roomId = socket.handshake.auth.roomId;
        const studentId = socket.handshake.auth.studentId;
        if(!username) {
            return next(new Error("Invalid username"));
        }
        if(!roomId) {
            return next(new Error("Invalid Room"));
        }
        if(!studentId) {
            return next(new Error("Invalid student id"));
        }

        //Verify student ID to stop ID spoofing(ish)
        userUtils.getUserById(server.pool, studentId, (user) => {
            if(user) {
                socket.username = username;
                socket.room = roomId;
                socket.studentId = studentId;
                next();
            } else {
                return next(new Error("Student ID doesn't exist"));
            }
        });
        
    });

    io.on("connection", (socket) => { //Called when a user connects
        console.log(socket.username + " has connected");
        socket.join(socket.room);

        //Grab previous 50 messages and send them to the user
        chatUtils.getPreviousMessages(server.pool, socket.room, 50, (messages) => {
            io.to(socket.id).emit('bulk message', messages);
        });

        io.to(socket.room).emit("user connected", {
            userID: socket.id,
            username: socket.username
        });

        socket.on("disconnecting", (reason) => { //Called when a client disconnects
            console.log(socket.username + " has left the room");
            io.to(socket.room).emit("user disconnecting", {
                userId: socket.id,
                username: socket.username
            })
        });

        socket.on("chat message", (message) => {
            let date = new Date().toTimeString();
            
            let msgToSend = socket.username + ": " + message;
            console.log("[" + socket.room + "] " + msgToSend);
            socket.to(socket.room).emit("chat message", msgToSend);
            chatUtils.logMessage(server.pool, socket.studentId, socket.room, message);
            
        });
    });
}