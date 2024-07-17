const personsRouter = require('express').Router()
const Person = require('../models/person')


//acceder a la lista de todas las personas
personsRouter.get('/', async (request, response) => {
  const contacts = await Person.find({/*si queda un objeto vacío busca todo, pero se pueden usar expresiones*/ })
  response.json(contacts)
  console.log(contacts)
})

//buscar un recurso específico

personsRouter.get('/:id', async (request, response) => {
      const person = await Person.findById(request.params.id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    } 
})

//crear un nuevo recurso
personsRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.name === undefined || body.name === '') {
    return response.status(400).json({ error: 'content missing' })
  }
  const person = new Person(
    {
      name: body.name,
      number: body.number,
    }
  )
  
    const savedPerson = await person.save()
    response.status(201).json(savedPerson)
    console.log('contact saved!')
  })

//borar un recurso específico
personsRouter.delete('/:id', async (request, response, next) => {
  
    await Person.findByIdAndDelete(request.params.id)
    response.status(204).end()
  

})

personsRouter.put('/:id', async (request, response, next) => {
  const { name, number } = request.body

  const personUpdated= await Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
  response.json(personUpdated)
    })   

module.exports = personsRouter