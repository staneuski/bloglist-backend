const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const SALT_ROUNDS = 10

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const user = new User({ username, name, passwordHash })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => { // eslint-disable-line no-unused-vars
  const users = await User
    .find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users)
})

module.exports = usersRouter