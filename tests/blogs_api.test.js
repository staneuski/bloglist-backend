const app = require('../app')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const supertest = require('supertest')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)

  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('GET /api/users', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are expected users count', async () => {
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(helper.initialUsers.length)
  })
})

describe('POST /api/users', () => {
  test('a valid user added with statuscode 201', async () => {
    const newUser = { username: 'JohnDoe', password: 'Doe' }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(helper.initialUsers.length + 1)
    expect(response.body.map(r => r.username)).toContain('JohnDoe')
  })

  test('fails with statuscode 400 if password is short', async () => {
    const newUser = { username: 'JohnDoe', password: 'JD' }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(helper.initialUsers.length)
  })

  test('fails with statuscode 400 if username is short', async () => {
    const newUser = { username: 'JD', password: 'JohnDoe', name: 'John Doe' }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(helper.initialUsers.length)
  })
})

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are expected blogs count', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
})

describe('POST /api/blogs', () => {
  test('a valid blog can be added', async () => {
    const user = helper.initialUsers[0]
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.SECRET
    )

    const newBlog = {
      author: user.name,
      title: 'Example Domain',
      url: 'https://example.com/'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(response.body.map(r => r.url)).toContain('https://example.com/')
  })

  test('fails with status code 401 if unauthorized', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const newBlog = {
      author: 'Unauthorized',
      title: 'Example Domain',
      url: 'https://example.com/'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('likes property of a blog is 0 by default', async () => {
    const user = helper.initialUsers[0]
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.SECRET
    )

    const newBlog = { title: 'Example Domain', url: 'https://example.com' }
    const blogsAtStart = await helper.blogsInDb()

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
    expect(blogsAtEnd[blogsAtStart.length].likes).toEqual(0)
  })

  test('blog without title or url is not added', async () => {
    const user = helper.initialUsers[0]
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.SECRET
    )

    const newBlog = { author: 'the title or url is missing' }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
})

describe('GET /api/blogs/:id', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body)
      .toEqual({ ...blogToView, user: blogToView.user.toString() })
  })

  test('the unique identifier property of a blog is named id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body._id).not.toBeDefined()
    expect(resultBlog.body.id).toBeDefined()
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('succeeds with status code 204 if user is authorized', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const user = helper.initialUsers.find(user =>
      user._id === blogToDelete.user.toString()
    )
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.SECRET
    )

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    expect(blogsAtEnd.map(r => r.url)).not.toContain(blogToDelete.url)
  })

  test('fails with status code 405 if not owned', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const user = helper.initialUsers.find(user =>
      user._id !== blogToDelete.user.toString()
    )
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.SECRET
    )

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(405)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
})

describe('PUT /api/blogs/:id', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: blogToUpdate.likes + 1 })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(blogsAtEnd[0].likes).toEqual(blogToUpdate.likes + 1)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})