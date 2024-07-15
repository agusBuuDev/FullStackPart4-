const mongoose = require('mongoose')
require('dotenv').config({path: './.env'})

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name= process.argv[3]
const number= process.argv[4]

const url =
  `mongodb+srv://agusbuu:${password}@agusbuutest.vwagzp6.mongodb.net/?retryWrites=true&w=majority&appName=AgusBuuTest`

mongoose.set('strictQuery',false)

mongoose.connect(url)
console.log('conexión exitosa');


const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Contact = mongoose.model('Note', contactSchema)

const person = new Contact({
  name: name,
  number: number,
})

person.save().then(result => {
  console.log('contact saved!')
  
})
  
 

Contact.find({/*si queda un objeto vacío busca todo, pero se pueden usar expresiones*/ }).then(result => {
  result.forEach(contact => {
    console.log(contact)
  })
  mongoose.connection.close()
})