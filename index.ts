import app from './app'
import http from 'http'
import config from './utils/config'
import { socketManager } from './utils/socket'
import { Server } from 'socket.io';

const server: http.Server = http.createServer(app)
const io = new Server(server);

io.use(socketManager)

io.on('connection', async function (socket: any){
  const roomSockets = await io.in(socket.userID).fetchSockets()
  const roomSocketsSessionIDs: any[] = roomSockets.map((soc: any)=> soc.sessionID)
  if(roomSocketsSessionIDs.indexOf(socket.sessionID) < 0){
    socket.join(socket.userID)
  }
  console.log(`+user ${socket.userID} connected`);
  io.emit('new-event');

  // emit session details
  socket.emit("session", {
    sessionID: socket.sessionID,
  });

  const matchingSockets = await io.in(socket.userID).allSockets();
  console.log(matchingSockets)
})

io.on('disconnect', function(socket){
  console.log(`+user ${socket.userID} disconnected`);
})
app.io = io

server.listen(config.PORT, (): void => {
  console.log(`Server running on port ${config.PORT}`)
})