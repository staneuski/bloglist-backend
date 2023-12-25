const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const SALT_ROUNDS = 10
const PASSWD_MIN_LEN = 3

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (password.length < PASSWD_MIN_LEN)
    return response.status(400).json({
      error: `password is too short (min. ${PASSWD_MIN_LEN} characters)`
    })

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