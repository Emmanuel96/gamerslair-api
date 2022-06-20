const socketManager = (socket, next) => {
//   const sessionID = socket.handshake.auth.sessionID;
//   if (sessionID) {
//     // find existing session
//     const session = sessionStore.findSession(sessionID);
//     if (session) {
//       socket.sessionID = sessionID;
//       socket.userID = session.userID;
//       return next();
//     }
//   }
  const userID = socket.handshake.auth.userId;
//   if (!userID) {
//     return next(new Error("invalid userId"));
//   }
  // create new session
//   socket.sessionID = randomId();
  socket.userID = userID;
  next();
}

module.exports.socketManager = socketManager