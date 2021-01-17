const generateMsg = (text)=>{
  return{
    text,
    created_On:new Date().getTime()
  }
}

const generateLocation = (url)=>{
  return{
    url,
    created_On:new Date().getTime()
  }
}

module.exports = {
  generateMsg
  ,generateLocation

}
