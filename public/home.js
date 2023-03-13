
const welcomeMessage = qs('#intro')
const greetingMessage = qs('#greetings')
function qs(selector, parent=document){
    return parent.querySelector(selector)              
}
async function getUser(){
   const { data:{ username, email } } = await axios.get('/user') 

   welcomeMessage.innerText = `Welcome to your dashbord ${ username}`
   greetingMessage.innerText = `Mr/Mrs ${ email } have a nice day, thanks for joining our community.`
}

getUser()