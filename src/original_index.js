const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/message.js')
const { addUser, removeUser, getUserByid, getUsersInRoom ,addRoomMsg} = require('./utils/userBase.js')
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
 // usernameList[{
    username : String,
     // }]
 room: String,
 id:String

});
var message = new mongoose.Schema({
  username:String,
  room:String,
  message:String,
  //createdOn:String
})
let UserBase = mongoose.model("User", user);
let MessageBase = mongoose.model("message",message);

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
    //console.log('New WebSocket connection')
    let database = client.db('chatRoom');
  //  console.log("HERE IS THE DATABASE")
  //  console.log(database.collection("user"))
    socket.on('join',({username,room}, callback) => {
      var chatRoomUser=[];
       database.collection('users').find({room :room}).toArray(async function(err, chatRoomUser){
         console.log(chatRoomUser)
        const { error, user } = addUser({id: socket.id,chatRoomUser,username,room})
        console.log("HAPPY BIRTHDSY")
        if (error) {
          console.log("HELLO BROTHER KASIA HAI")
          var chatRoomMessages = []

          // client.db("chatRoom").collection("messages").find({room :room}).toArray(function(err, chatRoomUser){
          //   //send messages to the front
          //   var chatRoomMessages = chatRoomUser
          //
          // })
          let chatRoomMessages2 = []
          console.log('GOLO00000000')

      chatRoomMessages2 = await retrieveOldMessages(client,room)

           console.log('GOLO')
           console.log(chatRoomMessages2)
          return callback(chatRoomMessages2);


        }

        // console.log('KE GOGGLES')

        socket.join(user.room)
        let  chatMessage  =  new UserBase(user);
        chatMessage.save();
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
      //  console.log(chatRoomUser)
    //    console.log(room)
        chatRoomUser.push(user)
        console.log("PARTY")
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: chatRoomUser
        })

        callback()
      })

    })

    socket.on('sendMessage', (createdOn,message, callback) => {
      database.collection('users').find(socket.id).toArray(function(err, chatRoomUser){

        const user = getUserByid(chatRoomUser,socket.id)
        // console.log("RROOOOMMMM ISSS SSS");
        // console.log(user)
        // console.log({username : user.username,message : message,room:user.room})

    //    const msgObj = addRoomMsg({username : user.username,message : message,room:user.room})
        let  chatMessageString  =  new MessageBase( {username:user.username,
          room:user.room,
          message:message});
        chatMessageString.save();
        // addMessageToDb(client, msgObj)
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
      })
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUserByid(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
      database.collection('users').find(socket.id).toArray(function(err, chatRoomUser){
    //    console.log(chatRoomUser)
        const user = removeUser(socket.id,chatRoomUser)
        if (user) {
          // console.log(chatRoomUser)
          // console.log("USER IS:")
          // console.log(user)
          deleteListingByName(client,user)
        //  console.log(chatRoomUser)
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            database.collection('users').find(user.room).toArray(function(err, remainingChatRoomUser){
//console.log(remainingChatRoomUser)
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: remainingChatRoomUser
            })
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
// //keep rendering message as it is but when a new user join use mongodb backup to populate older messages and if all ppl leave the group delete the entry from mongo db
//  function addMessageToDb(client, msgObj) {
//    console.log("HELLO BROTHER BROTHER HELLO BROTHER")
//    console.log(msgObj)
//     // result = client.db("chatRoom").collection("RoomMsg")
//     let  chatMessageString  =  new MessageBase( username:msgObj.username,
//       room:"S",
//       message:"D");
//     chatMessageString.save();
//
//     console.log(`addedChat message to db.`);
// }

async function retrieveOldMessages(client,roomName){
  console.log("HELLO FROM THE OTHER SIDES")
  allMessages =  await client.db("chatRoom").collection("messages").find({room : roomName}).toArray()
  return allMessages;
}
