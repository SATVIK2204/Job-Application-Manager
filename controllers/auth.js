const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  try {
    console.log('here');
    // res.send('<p>e</p>')
    res.render('login',{layout: './layouts/login',userExist: true});
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      // res.render('login', { layout: './layouts/login', userExist: true });
    } else {
      const user = await User.create({ ...req.body });

      const token = user.createJWT();
      res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
    }
  } catch (err) {
    console.error(err);
  }
  
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  // compare password
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
  register,
  login,
}
