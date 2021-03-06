const User = require('../models/User')
const jwt = require('jsonwebtoken')
const res = require('express/lib/response')

//handle errors
const handleErrors = (err) => {
  let errors = { email: '', password: '' }

  if (err.message === 'incorrect email') {
    errors.email = 'that eamil is not registered'
  }

  if (err.message === 'incorrect password') {
    errors.password = 'incorrect password'
  }

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

const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
  // jwt sing (entity + secret word)
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  })
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
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ user: user._id })
  } catch (error) {
    const errors = handleErrors(error)
    res.status(400).send({ errors })
  }
}

const login_post = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.login(email, password)
    //create token
    const token = createToken(user._id)

    //create cookie
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

    res.status(200).json({ user: user._id })

  } catch (error) {
    const errors = handleErrors(error)
    console.log(errors)
    res.status(400).json({ errors })
  }
}

const logout_get = (req, res) => {
  res.cookie('jwt', '', {maxAge: 1})
  res.redirect('/')
}

module.exports = { signup_get, signup_post, login_get, login_post, logout_get }