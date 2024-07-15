const _=require('lodash')

//primer función de prueba
const dummy = (blogs) => {
    return 1
}

//suma los likes de todos los post de la lista
const totalLikes = (list) => {

    const likes = list.map(post => post.likes)
    const sumLikes = (sum, item) => {
        return sum + item
    }
    const sum = likes.reduce(sumLikes, 0)
    return sum
}
//selecciona el post con mas likes, si hay mas de 1 el primero que tiene este número de likes en la lista
const favorite = (list) => {
    const likes = list.map(post => post.likes)
    const allFavPost = list.find(post => post.likes == Math.max(...likes))
    favPost = {
        title: allFavPost.title,
        author: allFavPost.author,
        likes: allFavPost.likes
    }
    return favPost
}

//selecciona el autor con más post, si hya más de 1 devuelve uno de ellos.

const mostBlogs = (list) =>{
    const autores = list.map(post=>post.author)
    const maxEntry = _.maxBy(_.entries(autores), ([, value]) => value)
    const [maxKey, maxValue] = maxEntry
    return {
        author: maxValue,
        blogs: maxKey
    }


}

const mostLikes = (list) =>{
    const authorLikes = list.map(post=>[post.author, post.likes])
    const agrupados = authorLikes.reduce((acc, [author, likes]) => {
        if (!acc[author]) {
          acc[author] = 0
        }
        acc[author] += likes
        return acc
      }, {})
      const maxEntry = _.maxBy(_.entries(agrupados), ([, value]) => value)
      const [maxKey, maxValue] = maxEntry
      return {
          author: maxKey,
          likes: maxValue
      }

   }

module.exports = {
    dummy,
    totalLikes,
    favorite, 
    mostBlogs, 
    mostLikes
}