const {Server} = require('socket.io');
const io = new Server();

io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error("invalid userId"));
    }
    socket.userId = userId;
    next();
});

io.on("connection", function (socket) {
    socket.join(socket.userId)
    console.log(`user ${socket.userId} connected`);
    io.emit('new-event',{userId:socket.userId})
});

exports.io = io;