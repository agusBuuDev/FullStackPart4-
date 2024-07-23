const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minLength: 6,
    required: true,
    unique: true // esto asegura la unicidad de username
  },
  name: String,
  passwordHash: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // el passwordHash no debe mostrarse
    delete returnedObject.passwordHash
  }
})
userSchema.plugin(require('mongoose-unique-validator'))

const User = mongoose.model('User', userSchema)

module.exports = User