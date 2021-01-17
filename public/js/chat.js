const socket = io()
//ELEMENTS
const $form = document.querySelector("#message-form")
const $msgBar = document.querySelector("#messageBar")
const $msgBtn = document.querySelector("#submitButton")
const $renderMsg = document.querySelector("#messages")


//TEMPLATES
const msgTemplate = document.querySelector("#message-script").innerHTML
const locationTemplate = document.querySelector("#location-script").innerHTML

//JOIN
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})
console.log(username)


socket.on('counterUpdated',(count)=>{
  console.log("UPDATE COUNT" + count)
})
socket.on('message',(message)=>{
  const html = Mustache.render(msgTemplate,{
    msg:message.text,
  createdOn:moment(message.created_On).format('h:mm a')
})
  $renderMsg.insertAdjacentHTML('beforeend',html)
})
// socket.on('recievedMsg',(msg)=>{
//   console.log("New Message Found " + msg)
// })
socket.on('sentlocation',(locationObj)=>{
  //const url = "https://google.com/maps?q=" + lat + "," + long;
  const locationhtml = Mustache.render(locationTemplate,{
    url:locationObj.url,
  createdOn:moment(locationObj.created_On).format('h:mm a')
})
  console.log(locationhtml)
  $renderMsg.insertAdjacentHTML('beforeend',locationhtml)
//  console.log("https://google.com/maps?q=" + lat + "," + long)

  //console.log("https://google.com/maps?q=" + lat + "," + long)
})
// document.querySelector("#increment").addEventListener('click',()=>{
//   socket.emit('increment')
// })

$form.addEventListener('submit',(e)=>{
 e.preventDefault()
 $msgBtn.setAttribute('disabled','disabled')
 const msg = e.target.elements.messageBar.value
  if(msg!=null){
  socket.emit('sentMsg',msg,()=>{
    $msgBtn.removeAttribute('disabled')
    $msgBar.focus()
    $msgBar.value =''

console.log("VERY  COOOOL")
  })
  }
})

document.querySelector("#send-location").addEventListener("click",()=>{
  if(!navigator.geolocation){

    return alert("Geolocation not supported by your browser");
  }
  document.querySelector("#send-location").setAttribute('disabled','disabled')

  navigator.geolocation.getCurrentPosition((position)=>{
    //console.log(position)
    socket.emit('sentlocation',{lat : position.coords.latitude,long:position.coords.longitude},()=>{
      document.querySelector("#send-location").removeAttribute('disabled')

console.log("location shared!!")
    })

  })
})

socket.emit("joined",{username,room})
