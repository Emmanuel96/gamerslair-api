const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const {socketManager} = require('./utils/socket')
const {Server} = require('socket.io');

const server = http.createServer(app)
const io = new Server(server);

io.use(socketManager)

io.on('connection', async function (socket){
  const roomSockets = await io.in(socket.userID).fetchSockets()
  const roomSocketsSessionIDs = roomSockets.map((soc)=> soc.sessionID)
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

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})

