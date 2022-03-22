const mongoose = require('mongoose')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter an valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter an password'],
    minlength: [6, 'Minimum password length is 6 characters']
  }
})
//fire a function before doc save to the db
userSchema.pre('save', function(next){
  console.log('user about to be created & saved ', this)
  next()
})


//fire a function after doc save to the db
userSchema.post('save', function (doc, next) {
  console.log('new user was created and saved', doc)
  next()
})

const User = mongoose.model('user', userSchema)

module.exports = User;