const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')

  response.json(users)
})

usersRouter.get('/:id', async (request, response, next) => {
  try {
    const user = await User.findById(
      request.params.id
    ).populate('blogs')

    if (!user) {
      return response.status(404).json({
        error: 'user not found'
      })
    }

    response.json(user)
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username || !password) {
    return response.status(400).json({
      error: 'username and password are required',
    })
  }

  if (
    username.length < 3 ||
    password.length < 3
  ) {
    return response.status(400).json({
      error:
        'username and password must be at least 3 characters long',
    })
  }

  const existingUser = await User.findOne({
    username
  })

  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique',
    })
  }

  const passwordHash = await bcrypt.hash(
    password,
    10
  )

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter