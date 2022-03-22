const User = require('../models/User')

//handle errors
const handleErrors = (err) => {
  let errors = { email: '', password: '' }

  //duplicate error code
  if (err.code == 11000) {
    errors.email = 'this email is already used'
    return errors
  }

  //validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(error => {
      errors[error.properties.path] = error.properties.message
    })
  }

  return errors
}

const signup_get = (req, res) => {
  res.render('signup')
}

const login_get = (req, res) => {
  res.render('login')
}

const signup_post = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.create({ email, password })
    res.status(201).json(user)
  } catch (error) {
    const errors = handleErrors(error)
    res.status(400).send({ errors })
  }
}

const login_post = (req, res) => {
  res.send('user login')
}

module.exports = { signup_get, signup_post, login_get, login_post }