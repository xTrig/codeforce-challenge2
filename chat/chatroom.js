module.exports = (io) => {
    io.use((socket, next) => {
        const username = socket.handshake.auth.username;
        const roomId = socket.handshake.auth.roomId;
        if(!username) {
            return next(new Error("Invalid username"));
        }
        if(!roomId) {
            return next(new Error("Invalid Room"));
        }
        socket.username = username;
        socket.room = room;
        next();
    });

    io.on("connection", (socket) => { //Called when a user connects
        socket.join(socket.room);
        io.to(socket.room).emit("user connected", {
            userID: socket.id,
            username: socket.username
        });

        socket.on("disconnecting", (reason) => { //Called when a client disconnects
            io.to(socket.room).emit("user disconnecting", {
                userId: socket.id,
                username: socket.username
            })
        });
    });
}