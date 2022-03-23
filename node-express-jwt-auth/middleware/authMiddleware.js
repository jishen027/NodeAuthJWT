const jwt = require('jsonwebtoken')

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt

  //check json web token exists & is verified

  if (token) {
    //token + secret word
    jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
      if (err) {
        //if an error, redirect to login page
        console.log(err)
        res.redirect('/login')
      } else {
        console.log(decodedToken)
        next()
      }
    })

  } else {
    res.redirect('/login')
  }
}

module.exports = { requireAuth }