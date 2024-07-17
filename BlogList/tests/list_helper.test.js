const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const Blog = require('../models/blog')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const helper = require('./test_helper')
const { log } = require('node:console')


describe('Se reinicia la BD de pruebas y se verifica que devuelva resultados json y el formato del ID', ()=>{
//reinicio al estado inicial de la BD de pruebas. 

beforeEach(async () => {
  await Blog.deleteMany({}) 
  const blogPromises = helper.modelPosts.map(post => {
    let blogObj = new Blog(post)
    return blogObj.save()
  })

  await Promise.all(blogPromises)
})

//test de json en la respuesta de la db
test('contacts are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
//el id de cada documento se transforma para eliminar el _
test('el ID se guarda correctamente', async ()=>{
  const blogList = await helper.postInDb()
  const idIsCorrect = blogList[0].id? true : false
  assert.strictEqual(idIsCorrect, true)
})

})
describe('se prueban las funcionalidades de GET general e individual, también individual con ID inválido', ()=>{
//test de get en la db y verificación de cantidad de registros

test('el GET anda joya', async ()=>{
  const response= await api.get('/api/blogs')
  console.log('hay en db cantidad de post: ', response.body.length)
  assert(response.body.length==helper.modelPosts.length)
 
 })
 
 //test de get inddividual
 test('el get individual anda joya', async ()=>{
   const response = await helper.postInDb()
   const id=response[0].id
   await api
   .get(`/api/blogs/${id}`)
   .expect(200)
 
 })

 test('Get individual con ID inválido devuelve 400', async ()=>{
  const invalidID='654654kjhjskadhk484654'
  await api.get(`/api/blogs/${invalidID}`)
  .expect(400)
 })
})
describe('Las operaciones de post, con esquema correcto y con distintos faltantes', ()=>{
//test para probar el post
test('el POST anda joya', async ()=>{
  const nuevoPost= {
   title: "La magia si existe",
   author: "AgusBuuDev",
   url: "https://howarts.com",
   likes: 5,
  }
  await api
  .post('/api/blogs')
  .send(nuevoPost)
  .expect(200)
 
  listUpdated= await helper.postInDb()
 
  assert(listUpdated.length==helper.modelPosts.length+1)
 
 })
 
 //test para comprobar que si un post no tiene la propiedad likes esta será cero. 
test('Likes es cero por defecto', async ()=>{
  const postSinLikes={
  title: "Winguardium leviosa",
  author: "AgusBuuDev",
  url: "https://howarts.com",
  }
  await api
  .post('/api/blogs/')
  .send(postSinLikes)
  .expect(200)

  const updatedList = await helper.postInDb()
  const newPostIndex = updatedList.length-1
  const newPost = updatedList[newPostIndex]
  assert.strictEqual(newPost.likes,0)

})

//test para comprobar que ante un faltante de titulo o url tira 400
test('title & url son requeridos', async ()=>{
const postNoTitle={
  author: "AgusBuuDev",
  url: "https://howarts.com",
  likes: 6
  }
const postEmptyTitle={
  title: "",
  author: "AgusBuuDev",
  url: "https://howarts.com",
  likes: 6
}
const postNoUrl={
  title: "Winguardium leviosa",
  author: "AgusBuuDev",
  likes: 5
}
const postEmptyUrl={
  title: "Winguardium leviosa",
  author: "AgusBuuDev",
  url: "",
  likes:5
}
await api
.post('/api/blogs/')
.send(postNoTitle)
.expect(400)
await api
.post('/api/blogs/')
.send(postEmptyTitle)
.expect(400)
await api
.post('/api/blogs/')
.send(postNoUrl)
.expect(400)
await api
.post('/api/blogs/')
.send(postEmptyUrl)
.expect(400)
})
})
describe('Se prueban las funciones de UPDATE y DELETE, también la respuesta de delete con ID inválido', ()=>{
//test para probar el update
test('el UPDATE anda joya', async ()=>{
  const response = await helper.postInDb()
  const postToUpdate = response[0]
  const postModified = {...postToUpdate, likes:postToUpdate.likes+2}
  await api
  .put(`/api/blogs/${postToUpdate.id}`)
  .send(postModified)
  .expect(200)

  const listUpdated = await helper.postInDb()
  assert(listUpdated[0].likes !== postToUpdate.likes)
  

})
//test para probar el delete
test('el delete anda joya', async ()=>{
  const response = await helper.postInDb()
  const toDelete = response[0].id
  await api
  .delete(`/api/blogs/${toDelete}`)
  .expect(204)
  const updatedList = await helper.postInDb()
  assert(updatedList.length == response.length-1)
})
//delete con id inválido
test('delete con un ID inválido devuelve 400', async ()=>{
  const invalidID= 'jsjsjsjsj'
  await api.delete(`/api/blogs/${invalidID}`)
  .expect(400)

})
})

//test de las primeras funciones sin supertest ejercicios 4.3 a 4.7

describe ('list_helper', ()=>{
    test('dummy returns one',() => {
        const blogs = []      
        const result = listHelper.dummy(blogs)
        assert.strictEqual(result, 1)
      })


})
describe('total likes', () => {
    
  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(helper.listWithOneBlog)
      assert.strictEqual(result, 5)
    })

    
      test('En esta lista grande la suma es 36 ', () => {
        const result = listHelper.totalLikes(helper.blogs)
        console.log(`la lista tiene: ${helper.blogs.length } elementos`)
        assert.strictEqual(result, 36)
      })

      test ('muestra el post con mas likes', ()=>{
        const result = listHelper.favorite(helper.blogs)
        assert.deepStrictEqual(result, {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
          })
      })
 
      test ('autores con más post', ()=>{
        result=listHelper.mostBlogs(helper.blogs)
        assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: '3' })
      })
    
      test ('autores con mas likes', ()=>{
        const result = listHelper.mostLikes(helper.blogs)
        assert.deepStrictEqual(result, {author: 'Edsger W. Dijkstra', likes: 17})
      })
  })

//cierra la conexión. 
after(async () => {
  await mongoose.connection.close()
})