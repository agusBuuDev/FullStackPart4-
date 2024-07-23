const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const blogSchema = new mongoose.Schema({
    title: {
      type: String,
      minLength: 3,
      required: true
    },
    author: String,
    url: {
      type: String,
      minLength: 3,
      required: true
    },
    likes: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  })
  
  blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  const Blog = mongoose.model('Blog', blogSchema)
  
  module.exports = mongoose.model ('Blog', blogSchema)