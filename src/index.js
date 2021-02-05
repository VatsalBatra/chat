const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/message.js')
const { addUser, removeUser, getUserByid, getUsersInRoom ,addRoomMsg} = require('./utils/userBase.js')
const passport = require('passport');

// const MongoClient = require('mongodb').MongoClient;
//const client = require('socket.io').listen(4000).sockets;
var MongoClient = require('mongodb').MongoClient;
const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb://localhost:27017/ChatRoom";
const  connect  =  mongoose.connect(url, { useNewUrlParser: true ,useUnifiedTopology: true });

//
// const  mongoose  = require("mongoose");
// mongoose.Promise  = require("bluebird");
var user = new mongoose.Schema({
 username: String,
 password: String, //TODO :MAKE THIS HIDDEN >>>>>GOOGLE IT
 joinedOn :String,
 id:String

});
var chat = new mongoose.Schema({
  id:String,
  msgString:String,
  username : String,
  createdAt : String

  //createdOn:String
})

let UserBase = mongoose.model("user", user);
let MessageBase = mongoose.model("chat",chat);

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
MongoClient.connect(url,(err, client) => {
    if(err){
        throw err;
    }

console.log('MongoDB connected...');
const bodyParser = require('body-parser');
const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

app.use(passport.initialize());
app.use(passport.session());
const passportLocalMongoose = require('passport-local-mongoose');
user.plugin(passportLocalMongoose);

passport.use(user.createStrategy());

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

io.on('connection', (socket) => {
    //console.log('New WebSocket connection')
    let database = client.db('ChatRoom');
    socket.on('join',({username,password}, callback) => {
      var chatRoomUser=[];
       database.collection('users').find().toArray(async function(err, chatRoomUser){
console.log(chatRoomUser)
        const { error,newUser } = addUser({id: socket.id,chatRoomUser,username,password})
        if(error){
          if(error === "Wrong Password")
          return callback({
          error:"WRONG ID_PASSWORD"});
          callback("wrong password")
          if (existingUser) {
            console.log("existingUser")
            let chatRoomMessages = []
        chatRoomMessages2 = await retrieveOldMessages(client,existingUser)
             console.log(chatRoomMessages2)
            return callback(chatRoomMessages2);
          }
        }
        console.log("ADDED NEW USER")
        let  chatMessage  =  new UserBase(newUser);
        chatMessage.save();
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage( `${user.username} has joined to Chat Room!`))
        chatRoomUser.push(user)
        io.emit('roomData', {
            room: "CHAT ROOM",
            users: chatRoomUser
        })

        callback()
      })

    })

    socket.on('sendMessage', (createdOn,message, callback) => {
      database.collection('users').find(socket.id).toArray(function(err, chatRoomUser){
        console.log(chatRoomUser)
              let  chatMessageString  =  new MessageBase( {username:user.username,
          room:user.room,
          message:message});
        chatMessageString.save();
        io.emit('message', generateMessage(user.username, message))
        callback()
      })
    })


//DISCARD
    socket.on('sendLocation', (coords, callback) => {
        const user = getUserByid(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

//TODO:call this when we click log out button
    socket.on('disconnect', () => {
      database.collection('users').find(socket.id).toArray(function(err, chatRoomUser){
        const user = removeUser(socket.id,chatRoomUser)
        if (user) {

          deleteListingByName(client,user)
            io.emit('message', generateMessage('Admin', `${user.username} has left!`))
            database.collection('users').find(user.room).toArray(function(err, remainingChatRoomUser){
            io.emit('roomData', {
                room: user.room,
                users: remainingChatRoomUser
            })
          })
        }

      })
    })
})
})


async function deleteListingByName(client, nameOfListing) {
    result = await client.db("chatRoom").collection("users")
         .deleteOne({username : nameOfListing.username});
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

async function retrieveOldMessages(client,existingUser){
  console.log("HELLO FROM THE OTHER SIDES")
//  TODO:  compare time between current login and original login to fetch all the chat
  allMessages =  await client.db("chatRoom").collection("messages").toArray()
  return allMessages;
}
