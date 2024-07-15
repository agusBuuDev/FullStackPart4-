const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const config = require('../utils/config')
//datos de conexión
//creación del esquema de cada documento mongo
  
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
      },
      number: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
              // Expresión regular que valida números, +, - y al menos 8 dígitos
              return /^[0-9+-]{8,}$/.test(v)
            },
            message: props => `${props.value} no es un número de teléfono válido. Debe contener solo números, +, - y al menos 8 dígitos.`
          }
      }
  })
  
  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  module.exports = mongoose.model('Person', personSchema)

  