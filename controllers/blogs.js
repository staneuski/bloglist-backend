const router = require('express').Router()

const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

router.get('/', async (request, response) => { // eslint-disable-line no-unused-vars
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

router.post('/', userExtractor, async (request, response) => {
  const user = request.user
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

router.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog)
    response.json(blog)
  else
    response.status(404).end()
})

router.delete('/:id', userExtractor, async (request, response) => {
  if (!request.user.blogs.find(blog => blog.toString() === request.params.id)) {
    response.status(401).json({ error: 'unauthorized operation' })
    return
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

router.put('/:id', (request, response, next) => {
  const blog = { likes: request.body.likes }
  Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then(updatedBlog => response.json(updatedBlog))
    .catch(error => next(error))
})

module.exports = router