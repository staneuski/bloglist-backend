/*
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const User = require('../models/user')

describe('POST /api/login', () => {
  test('', async () => {
    const newBlog = {
      username: 'JohnDoe',
      password: 'JohnDoe',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(response.body.map(r => r.url)).toContain('https://example.com/')
  })
})
*/