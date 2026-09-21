const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

// GET all blogs
blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1
    })

    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

// CREATE blog
blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const { title, author, url, likes } = request.body

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: request.user._id
    })

    const savedBlog = await blog.save()

    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

// UPDATE blog / LIKE
blogsRouter.put('/:id', userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({
        error: 'blog not found'
      })
    }

    const updatedData = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      updatedData,
      {
        new: true,
        runValidators: true
      }
    ).populate('user', {
      username: 1,
      name: 1
    })

    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

// DELETE blog
blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user')

    if (!blog) {
      return response.status(404).json({
        error: 'blog not found'
      })
    }

    const blogOwnerUsername =
      blog.user && blog.user.username

    const loggedUsername =
      request.user.username

    const sameUser =
      blog.user &&
      (
        blog.user._id.toString() === request.user._id.toString() ||
        blogOwnerUsername === loggedUsername
      )

    if (!sameUser) {
      return response.status(403).json({
        error: 'only the creator can delete the blog'
      })
    }

    await Blog.findByIdAndDelete(request.params.id)

    const owner = await User.findById(blog.user._id)

    if (owner) {
      owner.blogs = owner.blogs.filter(
        blogId =>
          blogId.toString() !== request.params.id
      )

      await owner.save()
    }

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// ADD COMMENT
blogsRouter.post('/:id/comments', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({
        error: 'blog not found'
      })
    }

    blog.comments = blog.comments.concat(request.body.comment)

    const savedBlog = await blog.save()

    response.status(200).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter