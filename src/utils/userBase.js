const users = []
var MongoClient = require('mongodb').MongoClient;
const  mongoose  = require("mongoose");
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb://localhost:27017/chatRoom";
//const  connect  =  mongoose.connect(url, { useNewUrlParser: true, seUnifiedTopology: true });
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
const addRoomMsg = ({username,message})=>{
  if(username!=null && message!=null){
 const roomMessage = {username,message}
    return{
      roomMessage
    }
  }
}
const addUser = ({id,chatRoomUser, username, password}) => {
    // Clean the data
    // username = username.trim().toLowerCase();
    // room = room.trim().toLowerCase();
    // console.log("HEELP")
    // console.log(chatRoomUser)
    // console.log("HEELP2313")

  // if(!username ||!password){
  //   return{
  //     error:"empty username / passoword" //TODO : WRONG  CONDITION
  //   }
  // }

if(chatRoomUser!=null){
  console.log(username)
  console.log(password)
  const exsitingUser = chatRoomUser.find((user)=>{
    console.log(user)
    return user.password === password && user.username === username})
  if(exsitingUser){
    return {
      exsitingUser:"Already present user/room"
    }
  }

  const wrongPassword = chatRoomUser.find((user)=>{
    if(user.username === username){
    console.log(user.password)
    console.log(password)
  }
    return user.username === username && user.password != password})
  if(wrongPassword){
    return {
      error:"Wrong Password"
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

 const newUser = {id :id,username:username,password:password,joinedOn:"hello"}

 console.log(newUser)
 return{
   newUser
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


// var Msgobj = {
//   id:22,
//   username:"vatsal",
//   msgString:"hello",
//   joinedOn : "HELLO"
// }
// var obj = {
//   id:22,
//   username:"vatsal",
//   password:"hello",
//   joinedOn : "HELLO"
// }
//
// // let  chatMessageString  =  new MessageBase(Msgobj );
// // chatMessageString.save();
// let  chatMessage  =  new UserBase({id : obj.id,username :obj.username,password : obj.password,joinedOn : obj.joinedOn});
// console.log(chatMessage)
//      chatMessage.save();
