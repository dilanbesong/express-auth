
const loginButton = qs('#login')

function qs(selector, parent=document){
  return parent.querySelector(selector)
}

loginButton.addEventListener('click', async(e) =>{
    e.preventDefault() 
    let email = qs('#loginEmail').value
    let password = qs('#loginPassword').value
    if(!email.includes('.com') && !email.includes('@')){
       qs('[data-response]').innerHTML = 'invalid email type !!'
       return
    }
    if(password.length > 5){
      qs('[data-response]').innerHTML = 'password must be greater than 5'
      return
    }
    let { data:{ msg, token } } =  await axios.post('/login', { email, password })
    if(msg === 'Invalid user'){
       qs('[data-response]').innerHTML = msg
       return
    }

    if( msg === 'home' && token){
      sessionStorage.setItem('token', token)
      location.href = '/home'
    }
              
})