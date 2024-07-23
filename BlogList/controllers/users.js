const userRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')
const bcrypt = require('bcrypt')


//traer todos
userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('posts', {title:1, url:1})
    response.json(users)
})


//taer 1 por id
userRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id).populate('posts', {title:1, url:1})
    response.json(user)
})

//agregar  

userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    if(!password){
        response.status(400).json({
            error: 'Password is required'
          })
    }else if(password.length<=4){
        response.status(400).json({
            error: 'Password is too short'
          })
    }else{
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
}
})


//delate

userRouter.delete('/:id', async (request, response) => {
    await User.findByIdAndDelete(request.params.id)
    response.status(204).end()
})


//update
userRouter.put('/:id', async (request, response) => {
    const { username, name, passwordHash, posts } = request.body
    const updatedUser = await User.findByIdAndUpdate(request.params.id, { username, name, passwordHash, posts }, { new: true, runValidators: true, context: 'query' })
    response.json(updatedUser)
})

module.exports = userRouter