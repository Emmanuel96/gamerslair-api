const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const socketManager = (socket, next) => {
    const userID = socket.handshake.auth.userId;
    if (!userID) {
        return next(new Error("invalid userId"));
    }
    socket.userID = userID
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
        socket.sessionID = sessionID;
        return next();
    }
    
    socket.sessionID = randomId();
    console.log(socket.sessionID)
    next();
}

module.exports.socketManager = socketManager