
const confirmcodeButton = document.querySelector('#confirmcode')
const responseText = document.querySelector('[data-response]')
confirmcodeButton.addEventListener('click', async (e) => {
    e.preventDefault() 
    const code = document.querySelector('#codeInput').value
    const email = document.querySelector('#email').value 
    const { data:{ msg } } = await axios.post('/sendcode', { code, email }) 
    if(msg === 'edit-password-route'){
        location.href = '/editpassword'
        return 
    }
    
    if( msg === 'Invalid user') {
      responseText.innerHTML = msg
      return
    }

    if(msg === 'No matching code'){
      responseText.innerHTML = msg
      return
    }

    responseText.innerHTML = "An error occured"
    return
})