const _ = require('lodash')

const dummy = (blogs) => { // eslint-disable-line no-unused-vars
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? {}
    : blogs.reduce((prev, curr) => (prev && prev.likes > curr.likes) ? prev : curr)
}

const mostBlogs = (blogs) => {
  return blogs.length === 0
    ? {}
    : _(blogs)
      .groupBy('author')
      .map((blogs, author) => ({ author, blogs: blogs.length }))
      .maxBy('blogs')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }