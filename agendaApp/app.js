const express = require ('express')
const app = express()
const cors = require('cors')
const config = require('./utils/config')
const personsRouter = require('./controllers/persons')
const middleware = require('./utils/middlewares')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGO_URI)

mongoose.connect(config.MONGO_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/people', personsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
