module.exports = (io) => {
    console.log("Setting up Socket.IO server...");
    io.use((socket, next) => {
        const username = socket.handshake.auth.username;
        const roomId = socket.handshake.auth.roomId;
        if(!username) {
            return next(new Error("Invalid username"));
        }
        if(!roomId) {
            return next(new Error("Invalid Room"));
        }
        socket.username = socket.handshake.auth.username;
        socket.room = socket.handshake.auth.roomId;
        next();
    });

    io.on("connection", (socket) => { //Called when a user connects
        console.log("A user has connected");
        socket.join(socket.room);
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
            console.log("Socket.IO: " + message);
        });
    });
}