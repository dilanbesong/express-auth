const { model, Schema } = require('mongoose')

const userSchema = new Schema({
   username:String,

   email:{
     type:String,
     require:true
   },

   password:String,

   Otp:{
     type:Number,
     default:0
   },

})

const User = model('Users', userSchema)

module.exports = { User }