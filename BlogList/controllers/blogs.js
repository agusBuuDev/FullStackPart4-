const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require ('../utils/logger')


//traer todos
blogRouter.get('/', async (request, response) => {
    const blogs= await Blog.find({})
    response.json(blogs)
    })
  

  //taer 1 por id
  blogRouter.get('/:id', async (request, response) => {
    const blog= await Blog.findById(request.params.id)
    response.json(blog)      
  })

  //agregar  
  blogRouter.post('/', async (request, response, next) => {
    const body = request.body
    if (body.title === undefined || body.title==='') {
      return response.status(400).json({ error: 'content missing' })
    }
    const blog = new Blog(
      {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes?body.likes:0
      }
      ) 
    
     const savedBlog= await blog.save()
        response.json(savedBlog)
        logger.info('Blog Saved')
      })

    //delate
  
    blogRouter.delete('/:id', async (request, response) => {
      await Blog.findByIdAndDelete(request.params.id )
      response.status(204).end()        
    })
  

  //update
  blogRouter.put('/:id', async (request, response) => {
    const {title, author, url, likes} = request.body
    updatedBlog= await Blog.findByIdAndUpdate(request.params.id, {title, author, url, likes}, { new: true, runValidators: true, context: 'query' })
    response.json(updatedBlog)
  })
      
  module.exports = blogRouter