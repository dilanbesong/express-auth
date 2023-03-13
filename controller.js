const { User } = require('./schema')
async function isExist(req, res, next){
   const user = await User.findOne({email:req.body.email})
   if(user){
     return res.send({msg:'user exist'})
   }
   next()
}

function checkIsAuthenticated(req, res, next){
  if(req.session.isloggedIn){
     return next()
  }
  return res.redirect('/')
}

function checkNotAuthenticated(req, res, next){
    if(req.session.isloggedIn){
     return res.redirect('/home')
  }
  return next()
}

function passwordRedirect(req, res, next){
  if(req.session.isPasswordRedirect){
    return next()
  }
  return res.redirect('/sendcode')
}

module.exports = { isExist, checkIsAuthenticated, checkNotAuthenticated, passwordRedirect }