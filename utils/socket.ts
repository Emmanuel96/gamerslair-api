import crypto from "crypto";

const randomId = (): string => crypto.randomBytes(8).toString("hex");

export const socketManager = (socket: any, next: any): any => {
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