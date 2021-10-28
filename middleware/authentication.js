const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
  // check cookie
   const token = req.cookies.access_token;
  if (!token) {
    throw new UnauthenticatedError('Authentication invalid');
  }
  

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // attach the user to the job routes
    
    req.user = { userId: payload.userId, name: payload.name }
    
    return next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth
