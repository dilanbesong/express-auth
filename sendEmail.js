const nodemailer = require('nodemailer')
require('dotenv').config()

const sendEmail = async (email, message) => {
 
let transporter = nodemailer.createTransport({
  service:'gmail',
  host: "smpt.gmail.com",

  secure: false, // true for 465, false for other ports
  auth: {
    user:process.env.SENDER_MAIL, // generated ethereal user
    pass:process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});
// send mail with defined transport object
let info = await transporter.sendMail({
  from: '"Dilan Besong 👻" <dylanbesong001@gmail.com>', // sender address
  to:email, // list of receivers[ can destructure emails from array]
  subject: "Get code ✔", // Subject line
  text: `Welcome ${email}:`, // plain text body
  html: message, // html body
});
console.log("Message sent: %s", info.messageId);       
}

module.exports = { sendEmail }