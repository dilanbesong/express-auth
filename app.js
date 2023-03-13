const express = require('express')
const mongoose = require('mongoose')
const { sendEmail } = require('./sendEmail')
const cors = require('cors')
const { isExist, checkIsAuthenticated, 
  checkNotAuthenticated, passwordRedirect } = require('./controller')
const { User } = require('./schema')
//const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const path = require('path')
const app = express()
const _path = path.resolve(__dirname, 'public')
const port = process.env.PORT || 3000
app.use(express.static(_path))
app.use(flash())
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Register'
mongoose.connect(MONGO_URI)
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri:MONGO_URI,
  collection: 'sessions'
});
app.use(session({
  secret:process.env.SESSION_SECRETE,
  saveUninitialized:false,
  resave:false,
  store
}))
app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
   return res.redirect('/register') 
})

app.get('/home', checkIsAuthenticated,  (req, res) => {
   return res.sendFile(_path + '/home.html')
})

app.get('/logout', (req, res) => {
   req.session.isloggedIn = false
   return res.redirect('/')
})

app.get('/register', checkNotAuthenticated,  (req, res) =>{

  return res.sendFile(_path + '/signUp.html')               
})

app.post('/register', isExist, async (req, res) =>{
    const newUser = new User(req.body)
    req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000
    req.session.user = newUser
    req.session.isloggedIn = true
    req.session.cookie.expires = false
    await newUser.save()
    sendEmail(newUser.email, `<b>Welcome to Dilan ventures Mr/Mrs ${newUser.username}.</b>`)
   const token = jwt.sign({user: newUser}, process.env.JWT_SECRETE, { expiresIn:'1hr'})
    return res.send({ msg:'home', token })
})

app.get('/login', checkNotAuthenticated,  (req, res) =>{
  return res.sendFile(_path + '/login.html') 
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({email})
  if( user == null){
    return res.send({msg:'Invalid user'})
  }
  if( user.password === password){
    // user will stay logged in for 1year
    req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000
    req.session.user = user
    req.session.isloggedIn = true

    // This user should log in again after restarting the browser
    req.session.cookie.expires = false
    const token = jwt.sign({user}, process.env.JWT_SECRETE, {expiresIn:'1hr'})
    sendEmail(user.email, `<b>Welcome to Dilan ventures Mr/Mrs ${user.username}.</b>`)
    return res.send({msg:'home', token})
  }
})
app.get('/user', async(req, res) => {
   try {
       const user = await User.findById(req.session.user._id)
       return res.send(user)
   } catch (error) {
       return res.send(error.message)
   }
})

app.get('/forgotten-password',  (req, res) => {
   return res.sendFile(_path + '/sendVerification.html')
})


app.post('/sendmail',  async (req, res) => {
   // Returns a random integer from 1 to 10:
   try {
        const { email } = req.body
        const user = await User.findOne({email})
       if( user === undefined){
           return res.send({ msg:false })
       }
      let generateOTP = Math.floor(Math.random() * 9999) + 1000
      await User.findOneAndUpdate({email}, {Otp:generateOTP})
     sendEmail(email, `<b>Your verification code is ${generateOTP}</b>`)
        return res.send({msg:true})
   } catch (error) {
      return res.send(error.message)
   }
})

app.get('/sendcode', (req, res) => {
   return res.sendFile(_path + '/entercode.html')
})

app.post('/sendcode', async(req, res) => {
  const { code, email } = req.body
  const user = await User.findOne({email})
  try {
     if( user === null){
        return res.status(200).send({msg:'Invalid user'})
      }
     if(user.Otp === parseInt(code)){
         req.session.user = user
         req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 365
         req.session.cookie.expires = false
         req.session.isPasswordRedirect = true
         return res.status(200).send({ msg:'edit-password-route' })
      }
       return res.send({msg:'No matching code'})
  } catch (error) {
    return res.send({msg:error.message})
  }
})

app.get('/editpassword', passwordRedirect, (req, res) => {
   return res.sendFile(_path + '/editpassword.html')
})

app.post('/editpassword', async (req, res) => {
  const { password1, password2 } = req.body
  try {
     if( password1 === password2){
       const updateUser = await User.findOneAndUpdate({email:req.session.user.email}, 
        { password:password1})
       if( updateUser !== null){
             req.session.isloggedIn = true
             const token = jwt.sign({user:updateUser}, process.env.JWT_SECRETE, {expiresIn:'1hr'})
             return res.status(200).send({ msg:'home', token })
       }else{
             return res.status(200).send({msg:'we could not update your passsword'})
       }
 }
 return res.status(200).send({msg:'Both fields values must be equal'})
  } catch (error) {
    return res.send({msg:'error'})
  }
})

app.listen(port, () => console.log(`Server is running on port ${port}...`))
//08165821661