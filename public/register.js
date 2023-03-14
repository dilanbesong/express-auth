
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
    if( username === ''){
      serverResponse.innerHTML = 'username must not not be empty'
      return
    }
    if( password.length < 5){
       serverResponse.innerHTML = 'password must be greater than 5 characters'
      return
    }
    if(!email.includes('@') && !email.includes('.com')){
       serverResponse.innerHTML = 'invalid email type'
       return
    }
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