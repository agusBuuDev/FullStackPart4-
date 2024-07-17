require('dotenv').config({path: './.env'})
const PORT = process.env.PORT

const user= process.env.DB_MONGO_USER
const password = process.env.DB_MONGO_PASS
const uri = process.env.DB_MONGO_URI
const uri_test=process.env.DB_MONGO_URI_TEST

const MONGO_URI =process.env.NODE_ENV === 'test' 
? `mongodb+srv://${user}:${password}${uri}`
: `mongodb+srv://${user}:${password}${uri_test}`

module.exports = {

  MONGO_URI,
  PORT
}