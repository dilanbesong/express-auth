
function qs(selector, parent=document){
    return parent.querySelector(selector)
}

const responseText = qs('[updatePassword]')
const newPasswordInput = qs('#password1')
const confirmNewPasswordInput = qs('#password2')
const updatePasswordButton = qs('#updatePassword')
const newPasswordInput1 = qs('input[type="text"]')
const checkbox = qs('#checkbox')

checkbox.addEventListener('change', e => {
   if(checkbox.checked){
     newPasswordInput.setAttribute('type', 'password')
     confirmNewPasswordInput.setAttribute('type', 'password')
     return
   }
   newPasswordInput.setAttribute('type', 'text')
   confirmNewPasswordInput.setAttribute('type', 'text')
   return

})

updatePasswordButton.addEventListener('click', async (e) => {
      const password1 = qs('#password1').value 
      const password2 = qs('#password2').value 
      const { data:{ msg, token } } = await axios.post('/editpassword', { password1, password2 })
      if( msg === 'home'){
          sessionStorage.setItem('token', token)
          location.href = '/home' 
          return 
      }
      if( msg === 'we could not update your passsword'){
          responseText.innerHTML = msg
          return
      }
      if( msg === 'Both fields values must be equal'){
         responseText.innerHTML = msg
         return
      }
      if( msg === 'error'){
          responseText.innerHTML = 'Something went please try again later :(' 
          return
      }
      

})