import app from './app'
import http from 'http'
import PORT from './utils/config'

const server: any = http.createServer(app)

server.listen(PORT, (): void => {
  console.log(`Server running on port hi`)
})