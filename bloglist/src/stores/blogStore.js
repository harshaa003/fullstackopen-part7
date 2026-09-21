import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set) => ({
  blogs: [],

  initialize: async () => {
    const blogs = await blogService.getAll()
    set({ blogs })
  },

  createBlog: async (blog, token) => {
    const newBlog = await blogService.create(blog, token)

    set(state => ({
      blogs: state.blogs.concat(newBlog)
    }))

    return newBlog
  },

  updateBlog: async (id, updatedBlog, token) => {
    const returnedBlog = await blogService.update(
      id,
      updatedBlog,
      token
    )

    set(state => ({
      blogs: state.blogs.map(blog =>
        blog.id === returnedBlog.id
          ? returnedBlog
          : blog
      )
    }))

    return returnedBlog
  },

  likeBlog: async (id, blog, token) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user:
        typeof blog.user === 'object'
          ? blog.user.id
          : blog.user
    }

    const returnedBlog = await blogService.update(
      id,
      updatedBlog,
      token
    )

    set(state => ({
      blogs: state.blogs.map(blog =>
        blog.id === returnedBlog.id
          ? returnedBlog
          : blog
      )
    }))

    return returnedBlog
  },

  removeBlog: async (id, token) => {
    await blogService.remove(id, token)

    set(state => ({
      blogs: state.blogs.filter(
        blog => blog.id !== id
      )
    }))
  }
}))

export default useBlogStore