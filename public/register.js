
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
    if( qs('#username').value === ''){
      serverResponse.innerHTML = 'Username must not not be empty'
      return
    }
    if( qs('#email').value.length < 5){
       serverResponse.innerHTML = 'Password must be greater than 5 characters'
      return
    }
    if(!qs('#email').value.includes('@') && !qs('#email').value.includes('.com')){
       serverResponse.innerHTML = 'Invalid email type'
       return
    }
    const dataResponse = await axios.post('/register', { username, email, password } )  
    const { msg, token } = dataResponse.data
  
   if(msg === 'user exist'){
       serverResponse.innerHTML = 'User exist'
       return
    }
    if( msg === 'home' && token){
      sessionStorage.setItem('token', token)
      location.href = '/home'
      return
    }
})