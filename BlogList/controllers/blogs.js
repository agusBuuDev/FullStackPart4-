const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

//función de verificación de login

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }

//traer todos
blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username:1, name:1} )
  response.json(blogs)
})


//taer 1 por id
blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {username:1, name:1  })
  response.json(blog)
})

//agregar  
blogRouter.post('/', async (request, response, next) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)  
  const user = await User.findById(decodedToken.id)

  console.log('el usuario relacionado es: ',user)
  if (body.title === undefined || body.title === '') {
    return response.status(400).json({ error: 'content missing' })
  }
  const blog = new Blog(
    {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ? body.likes : 0,
      user: user.id
    }
  )

  const savedBlog = await blog.save()
  user.posts = user.posts.concat(savedBlog.id)
  await user.save()
  logger.info('Blog Saved')
  response.status(201).json(savedBlog)

})

//delate

blogRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id) 
  const user = await User.findById(blog.user)
  const toDelete= user.posts.indexOf(blog.id)

  if (blog.user.toString() !== request.user.id) {
    return response.status(401).json({ error: 'unauthorized user' })
  }

  user.posts.splice(toDelete)
  await user.save()
  await Blog.findByIdAndDelete(request.params.id)
  
  response.status(204).end()
  
})


//update
blogRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, user } = request.body
  updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes }, { new: true, runValidators: true, context: 'query' })
  response.json(updatedBlog)
})

module.exports = blogRouter