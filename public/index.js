const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const {
  getUserByid,
  getusersInRoom,
  addUser,
  removeUser
} = require('./utils/userBase.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')
    console.log("UOUOUOUOUO")
    socket.on('join', (options, callback) => {
        const { error, user } = addUser(socket.id,user.username,user.room)

        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        console.log("UOUOUOUOUO")

        socket.emit('message', generateMessage("Welcome",'ADMIN'))
        socket.broadcast.to(user.room).emit('message', generateMessage( user.username +  'has joined!' ,"Admin"))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
      console.log("UOUOUOUOUO")
        const user = getUserByid(socket.id)
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
