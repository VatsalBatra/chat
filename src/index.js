const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/message.js')
const { addUser, removeUser, getUserByid, getUsersInRoom } = require('./utils/userBase.js')
// const MongoClient = require('mongodb').MongoClient;
//const client = require('socket.io').listen(4000).sockets;
var MongoClient = require('mongodb').MongoClient;
const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb://localhost:27017/chatRoom";
const  connect  =  mongoose.connect(url, { useNewUrlParser: true  });
//
// const  mongoose  = require("mongoose");
// mongoose.Promise  = require("bluebird");
var user = new mongoose.Schema({
 username: String,
 room: String,
 id:String
});

let UserBase = mongoose.model("User", user);
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
// MongoClient.connect(url,(err, client) => {
//     if(err) throw err;
//
//     let database = client.db('chatRoom');
//
//     database.collection('users').find()
//     .toArray((err, results) => {
//         if(err) throw err;
//
//         results.forEach((value)=>{
//             console.log(value.name);
//         });
//     })
// })
MongoClient.connect(url,(err, client) => {
    if(err){
        throw err;
    }

console.log('MongoDB connected...');

io.on('connection', (socket) => {
    console.log('New WebSocket connection')
    let database = client.db('chatRoom');
    console.log("HERE IS THE DATABASE")
  //  console.log(database.collection("user"))
    socket.on('join', ({username,room}, callback) => {
    //  let a = []
       database.collection('users').find(room).toArray(function(err, chatRoomUser){
         console.log(chatRoomUser)
        const { error, user } = addUser({id: socket.id,chatRoomUser,username,room})
console.log("HAPPY BIRTHDSY")
        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        let  chatMessage  =  new UserBase(user);
        chatMessage.save();
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
      })

    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUserByid(socket.id)

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUserByid(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
      database.collection('users').find(socket.id).toArray(function(err, chatRoomUser){
        console.log(chatRoomUser)
        const user = removeUser(socket.id,chatRoomUser)
        if (user) {
          console.log(chatRoomUser)
          console.log("USER IS:")
          console.log(user)
          deleteListingByName(client,user)
          console.log(chatRoomUser)
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

      })
    })
})
})
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})

async function deleteListingByName(client, nameOfListing) {
    result = await client.db("chatRoom").collection("users")
         .deleteOne({ room : nameOfListing.room,username : nameOfListing.username});
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}
