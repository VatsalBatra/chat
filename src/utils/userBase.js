const users = []
var MongoClient = require('mongodb').MongoClient;
const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb://localhost:27017/chat";
//const  connect  =  mongoose.connect(url, { useNewUrlParser: true, seUnifiedTopology: true });
var user = new mongoose.Schema({
 username: String,
 room: String,
 id:String
});

var RoomMsg = new mongoose.Schema({
  username:String,
  room:String,
  message:String,
//  createdOn:String
})
// let UserBase = mongoose.model("User", user);

//add User
//REMOVE User
//FETCH USER
//user in rooms
const removeUser = ((id,chatRoomUsers)=>{
  // console.log("CHATROOM USERS ARE")
  // console.log(chatRoomUsers)
  const toBeRomvedUser = chatRoomUsers.find((user)=>user.id==id)
  if(toBeRomvedUser!=null){
    //console.log("FOUND SOMEBODY")
    return toBeRomvedUser;
  }
})
const addRoomMsg = ({username,message,room})=>{
  if(username!=null && message!=null && room!=null){
 const roomMessage = {username,message,room}
    return{
      roomMessage
    }
  }
}
const addUser = ({id,chatRoomUser, username, room}) => {
    // Clean the data
    // username = username.trim().toLowerCase();
    // room = room.trim().toLowerCase();
    // console.log("HEELP")
    // console.log(chatRoomUser)
    // console.log("HEELP2313")

  if(!username ||!room){
    return{
      error:"empty username / room" //TODO : WRONG  CONDITION
    }
  }
if(chatRoomUser!=null){
  const exsitingRoom = chatRoomUser.find((user)=>{
    return user.room === room && user.username === username})
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
 return{
   user
 }
}


const getUserByid = ((getUserByid,id)=>{
return getUserByid.find((user)=>user.id ===id)
})
const getUsersInRoom = ((getUsersInRoom)=>{

  return  getUsersInRoom.filter((user)=>user.room === room)
})

module.exports={
  getUserByid,
  getUsersInRoom,
  addUser,
  removeUser,
  addRoomMsg
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
