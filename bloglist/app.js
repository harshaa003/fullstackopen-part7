const express = require('express')
const path = require('path')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const Blog = require('./models/blog')
const User = require('./models/user')

const app = express()

app.use(express.json())

app.use(middleware.tokenExtractor)

app.post('/api/testing/reset', async (request, response, next) => {
  try {
    await Blog.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(express.static(path.join(__dirname, 'dist')))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message,
    })
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'token invalid',
    })
  }

  next(error)
}

app.use(errorHandler)

module.exports = app