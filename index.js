const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const {socketManager} = require('./utils/socket')
const {Server} = require('socket.io');

const server = http.createServer(app)
const io = new Server(server);

io.use(socketManager)

io.on('connection', function (socket){
  socket.join(socket.userID)
  console.log(`+user ${socket.userID} connected`);
  io.emit('new-event');
})

app.io = io

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})

