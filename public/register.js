
const registerButton = qs('#register')
const serverResponse = qs('#res')

function qs(selector, parent=document){
  return parent.querySelector(selector)
}

registerButton.addEventListener('click', async (e) =>{
    e.preventDefault() 
    const username = qs('#username').value
    const email = qs('#email').value
    const password = qs('#password').value 
    const dataResponse = await axios.post('/register', { username, email, password } )  
    const { msg, token } = dataResponse.data
  
   if(msg === 'user exist'){
       serverResponse.innerHTML = 'user exist'
       return
    }
    if( msg === 'home' && token){
      sessionStorage.setItem('token', token)
      location.href = '/home'
      return
    }
})