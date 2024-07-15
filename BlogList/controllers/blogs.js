const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require ('../utils/logger')


//traer todos
blogRouter.get('/', (request, response) => {
    Blog.find({})
      .then(blogs => {
        response.json(blogs)
    })
  })

  //taer 1 por id
  blogRouter.get('/:id', (request, response, next) => {
    Blog.findById(request.params.id).then(blog => {
      if(blog){
        response.json(blog)
      }else{
        response.status(404).end()
      }
      
    })
    .catch(error => next(error))
  })

  //agregar  
  blogRouter.post('/', (request, response, next) => {
    const body = request.body
   
    if (body.title === undefined || body.title==='') {
      return response.status(400).json({ error: 'content missing' })
    }
    const blog = new Blog(
      {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
      }
      ) 
    
     blog.save().then(savedBlog => {
        response.json(savedBlog)
        logger.info('Blog Saved')
    })
    .catch(error => next(error))
   
    })

    //delate
  
    blogRouter.delete('/:id', (request, response, next) => {
      
      Blog.findByIdAndDelete(request.params.id )
        .then(result => {
          response.status(204).end()
        })
        .catch(error => next(error))
    })
  

  //update
  blogRouter.put('/:id', (request, response, next) => {
    const {title, author, url, likes} = request.body
       
    Blog.findByIdAndUpdate(request.params.id, {title, author, url, likes}, { new: true, runValidators: true, context: 'query' })
      .then(updatedBlog => {
        response.json(updatedBlog)
      })
      .catch(error => next(error))
  })
  module.exports = blogRouter