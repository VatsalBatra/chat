const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const {generateMsg,generateLocation} = require('./utils/message.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
let count= 0;
io.on('connection', (socket) => {
    console.log('New WebSocket connection')


    // socket.emit("counterUpdated",count)
    // socket.on('increment', () => {
    //   count++;
    // io.emit("counterUpdated",count)
    // })
    socket.on('disconnect', () => {
    io.emit("message",generateMsg("User disconnected!!"))
    })
    socket.on('joined', ({username,room}) => {
      socket.join(room)
      socket.emit("message",generateMsg("welcome!!"))
      socket.broadcast.to(room).emit("message",generateMsg(username + 'has joined the room'))
    })

    socket.on('sentMsg', (msg,callback) => {
    io.emit("message",generateMsg(msg))
    callback()
    })

    socket.on('sentlocation', ({lat,long},callback) => {
    socket.broadcast.emit("sentlocation", generateLocation("https://google.com/maps?q=" + lat + "," + long))
    callback()
    })
})



server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
