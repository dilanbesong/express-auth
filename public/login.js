
const loginButton = qs('#login')

function qs(selector, parent=document){
  return parent.querySelector(selector)
}

loginButton.addEventListener('click', async(e) =>{
    e.preventDefault() 
    let email = qs('#loginEmail').value
    let password = qs('#loginPassword').value
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