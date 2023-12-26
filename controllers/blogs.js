const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => { // eslint-disable-line no-unused-vars
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id)
    return response.status(401).json({ error: 'token invalid' })

  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    user: user._id,
    url: request.body.url,
    title: request.body.title,
    author: request.body.author,
    likes: request.body.likes
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog)
    response.json(blog)
  else
    response.status(404).end()
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', (request, response, next) => {
  const blog = {
    url: request.body.url,
    title: request.body.title,
    author: request.body.author,
    likes: request.body.likes
  }
  Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then(updatedBlog => response.json(updatedBlog))
    .catch(error => next(error))
})

module.exports = blogsRouter