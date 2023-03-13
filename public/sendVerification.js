
function qs(selector, parent=document){
    return parent.querySelector(selector)
}

const sendEmailButton = qs('#sendmail')
const dataResponse = qs('[data-response]')
const nextButton = qs('[data-next]')
nextButton.style.display = 'none'

sendEmailButton.addEventListener('click', async (e) => {
    e.preventDefault()
    const email = qs('#email').value.trim()
    
    try {
       const { data:{ msg } } = await axios.post('/sendmail', { email }) 
       if( msg ){
            dataResponse.innerHTML = 'check email to get verification code'
            nextButton.style.display = 'inline-block'
            return
        }
       dataResponse.innerHTML = 'No user with this email' 
    } catch (error) {
        dataResponse.innerHTML = 'Something went wrong please try again later'
    }
})