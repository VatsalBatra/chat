const users = []
var MongoClient = require('mongodb').MongoClient;
const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb://localhost:27017/chat";
//const  connect  =  mongoose.connect(url, { useNewUrlParser: true, seUnifiedTopology: true });
var user = new mongoose.Schema({
 room: String,
 username:{
   'type': {type: String},
   			'value': [String]
 },
 id:String
});

var RoomMsg = new mongoose.Schema({
  username:String,
  room: String,
  message:String

})
// let UserBase = mongoose.model("User", user);

//add User
//REMOVE User
//FETCH USER
//user in rooms
const removeUser = ((id,chatRoomUsers)=>{
  console.log("CHATROOM USERS ARE")
  console.log(chatRoomUsers)
  const toBeRomvedUser = chatRoomUsers.find((user)=>user.id==id)
  if(toBeRomvedUser!=null){
    console.log("FOUND SOMEBODY")
    return toBeRomvedUser;
  }
})
const addUser = ({id,chatRoomUser, username, room}) => {
    // Clean the data
    // username = username.trim().toLowerCase();
    // room = room.trim().toLowerCase();
    console.log("HEELP")
    console.log(chatRoomUser)
    console.log("HEELP2313")

  if(!username ||!room){
    return{
      error:"empty username / room"
    }
  }
if(chatRoomUser!=null){
  const exsitingRoom = chatRoomUser.forEach(user).function(user)=>{
    return user.room === room && user.username === username}
  if(exsitingRoom){
    return {
      error:"Already present user/room"
    }
  }
}
//   const checkDataBase = MongoClient.connect(url,(err, client)=> {
// if (err) throw err;
//    let database = client.db('chat');
// var hello = database.collection('users').find({room: room})
//     .toArray((err, results) => {
//         if(err) throw err;
//        return results.find((user)=>{ return user.room === room && user.username === username
//         })
//
//     })
// return hello;
// })

 const user = {id,username,room}
 users.push(user)
 return{
   user
 }
}
const addUserAndMsgData=(({room,message})=>{

})

const getUserByid = ((id)=>{
return users.find((user)=>user.id ===id)
})
const getUsersInRoom = ((room)=>{

  return  users.filter((user)=>user.room === room)
})
module.exports={
  getUserByid,
  getUsersInRoom,
  addUser,
  removeUser
}
// addUser({
//   id:22,
//   username:"vatsal",
//   room:"hello"
// })
// addUser({
//   id:24,
//   username:"vatsal1",
//   room:"hello"
// })
// addUser({
//   id:25,
//   username:"vatsal2",
//   room:"hello1"
// })
// addUser({
//   id:26,
//   username:"vatsal",
//   room:"hello2"
// })
//
// console.log(getusersinRoom("hello"))
// console.log(getUserByid(26))
//
// console.log(users)
