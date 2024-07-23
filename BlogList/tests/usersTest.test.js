const bcrypt = require('bcrypt')
const User = require('../models/user')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const helper = require('./test_helper')
const { log } = require('node:console')
const blog = require('../models/blog')

describe('USER: Estado inicial de la db en el momento de las pruebas', () => {

    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('samanta4444', 10)
        const user = new User({ username: 'rootTest', passwordHash })
        await user.save()
        const user2 = new User({ username: 'root2Test', passwordHash })
        await user2.save()

       
    })
})

describe('creación de un usuario', () => {
    test('creación de un nuevo usuario', async ()=>{

        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
          }
        await api
        .post('/api/users/')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtStart.length+1, usersAtEnd.length)
    })
    test('requisito de unicidad del username', async ()=>{
        const user1= {
            username:"AgusBuuDev",
            name:"Agus",
            password: "asjhakjsd"
        }
        const user2= {
            username:"AgusBuuDev",
            name:"Agustina",
            password: "asj2873hakjsd"
        }
        await api
        .post('/api/users/')
        .send(user1)
        .expect(201)

        await api
        .post('/api/users/')
        .send(user2)
        .expect(400)
    })
    test('requisito de password obligatorio y 6 char o más', async ()=>{
        const user1= {
            username:"Lili766",
            name:"Agus",
        }
        const user2= {
            username:"Lili766",
            name:"Agustina",
            password: "asj"
        }   
        const userDbBefore =await helper.usersInDb()

        await api
        .post('/api/users/')
        .send(user1)
        .expect(400)

        await api
        .post('/api/users/')
        .send(user2)
        .expect(400)

        const userDbAfter = await helper.usersInDb()

        assert.strictEqual(userDbBefore.length, userDbAfter.length)

    })   
})

describe('creación de post y autorización de usuarios', ()=>{
    test('creación de un post sin login', async()=>{
        const nuevoBlog =   {
            "title": "mi vida es perfecta",
            "author": "AgusBuuDev",
            "url": "https://howarts.com",
        }

        await api
        .post('/api/blogs/')
        .send(nuevoBlog)
        .expect(401)
    })

    test('creación de un post con login', async()=>{
        const postBefore=await helper.postInDb()
        const user = {
            username:'rootTest',
            password:'samanta4444'
        }
        const nuevoBlog =   {
            "title": "mi vida es perfecta",
            "author": "AgusBuuDev",
            "url": "https://howarts.com",
        }
        const response = await api
        .post('/api/login/')
        .send(user)
        const token = response.body.token
        console.log('el token se guardó correctamente: ', token)
        await api
        .post('/api/blogs/')
        .send(nuevoBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        const postAfter = await helper.postInDb()

        assert.strictEqual(postBefore.length+1,postAfter.length)
})
})

describe('pruebas para la delete', ()=>{
    test('delete con token', async()=>{
        const user = {
            username:'rootTest',
            password:'samanta4444'
        }
        const user2 = {
            username:'root2Test',
            password:'samanta4444'
        }
        const postBefore = await helper.postInDb()
        console.log('los posts al inicio son:', postBefore)
        const userLoged= await api
        .post('/api/login/')
        .send(user)
        console.log('el user fue logueado: ', user.username)
        const token = userLoged.body.token


        //agregaré un post asignado a rootTest
        await api
        .post('/api/blogs/')
        .send({
            title: 'lo logré',
            author: 'AgusBuuDev',
            url: 'https://howarts.com',
        })
        .set('Authorization', `Bearer ${token}`)
        
        console.log('el post fue agregado')


        //cambiamos al usuario root2test
        
        console.log(`el usuario ${user2} fue logueado`)

        //actualizamos el token
        const newUserLoged= await api
        .post('/api/login/')
        .send(user2)

        const newToken= newUserLoged.body.token

        //selecciono el último post agregado. 
        const postAfter= await helper.postInDb()
        const ultimoPost=postAfter[postAfter.length-1]
        console.log('el ultimo post agregado es: ', ultimoPost)

        //intento borrar el post con el nuevo token

        await api 
        .delete(`/api/blogs/${ultimoPost.id}`)
        .set('Authorization', `Bearer ${newToken}`)
        .expect(401)
        
        await api 
        .delete(`/api/blogs/${ultimoPost.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

       
    })
})
after(async () => {
    await mongoose.connection.close()
})