const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const {io} = require('./utils/socket')

const server = http.createServer(app)
io.attach(server);

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})