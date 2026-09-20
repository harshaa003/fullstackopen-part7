import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom'
import styled from 'styled-components'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import axios from 'axios'

import useNotificationStore from './stores/notificationStore'
import useBlogStore from './stores/blogStore'
import useUserStore from './stores/userStore'

const Navigation = styled.nav`
  background: #333;
  padding: 12px 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;

  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
  }

  button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`

const UserInfo = styled.span`
  color: white;
`

const Notification = styled.div`
  background: #e0f2e9;
  border: 2px solid #2e8b57;
  color: #256d3f;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  font-weight: bold;
`

const LoginForm = styled.div`
  background: #f5f5f5;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  max-width: 400px;
`

const FormRow = styled.div`
  margin-bottom: 12px;
`

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: bold;
  gap: 5px;
`

const Input = styled.input`
  padding: 8px;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 16px;
`

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 15px;
`

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const notification = useNotificationStore(
    state => state.notification
  )

  const setNotification = useNotificationStore(
    state => state.setNotification
  )

  const blogs = useBlogStore(
    state => state.blogs
  )

  const initializeBlogs = useBlogStore(
    state => state.initialize
  )

  const createBlog = useBlogStore(
    state => state.createBlog
  )

  const updateBlog = useBlogStore(
    state => state.updateBlog
  )

  const likeBlog = useBlogStore(
    state => state.likeBlog
  )

  const removeBlog = useBlogStore(
    state => state.removeBlog
  )

  const user = useUserStore(
    state => state.user
  )

  const setUser = useUserStore(
    state => state.setUser
  )

  const clearUser = useUserStore(
    state => state.clearUser
  )

  useEffect(() => {
    initializeBlogs()
  }, [initializeBlogs])

  useEffect(() => {
    const loggedUserJSON =
      window.localStorage.getItem(
        'loggedBloglistUser'
      )

    if (loggedUserJSON) {
      setUser(JSON.parse(loggedUserJSON))
    }
  }, [setUser])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const response = await axios.post(
        '/api/login',
        {
          username,
          password
        }
      )

      const loggedUser = response.data

      window.localStorage.setItem(
        'loggedBloglistUser',
        JSON.stringify(loggedUser)
      )

      setUser(loggedUser)
      setUsername('')
      setPassword('')

      setNotification(
        `Welcome ${
          loggedUser.name ||
          loggedUser.username
        }`,
        'success'
      )
    } catch {
      setNotification(
        'Wrong username or password',
        'error'
      )
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(
      'loggedBloglistUser'
    )

    clearUser()

    setNotification(
      'Logged out successfully',
      'success'
    )
  }

  const handleCreateBlog = async blog => {
    try {
      const createdBlog =
        await createBlog(
          blog,
          user.token
        )

      setNotification(
        `a new blog ${createdBlog.title} added`,
        'success'
      )

      return createdBlog
    } catch {
      setNotification(
        'Adding the blog failed',
        'error'
      )

      throw new Error(
        'Adding blog failed'
      )
    }
  }

  const handleUpdateBlog = async (
    updatedBlog,
    id
  ) => {
    try {
      const returnedBlog =
        await updateBlog(
          id,
          updatedBlog,
          user.token
        )

      return returnedBlog
    } catch {
      setNotification(
        'Updating the blog failed',
        'error'
      )

      throw new Error(
        'Updating blog failed'
      )
    }
  }

  const handleLikeBlog = async blog => {
    try {
      await likeBlog(
        blog.id,
        blog,
        user.token
      )
    } catch {
      setNotification(
        'Liking the blog failed',
        'error'
      )
    }
  }

  const handleRemoveBlog = async id => {
    try {
      await removeBlog(
        id,
        user.token
      )

      setNotification(
        'Blog removed successfully',
        'success'
      )
    } catch {
      setNotification(
        'Removing the blog failed',
        'error'
      )

      throw new Error(
        'Removing blog failed'
      )
    }
  }

  const Blogs = () => (
    <div>
      <h2>blogs</h2>

      {blogs
        .slice()
        .sort(
          (a, b) => b.likes - a.likes
        )
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={handleLikeBlog}
          />
        ))}
    </div>
  )

  const Login = () => {
    if (user) {
      return <Navigate to="/" />
    }

    return (
      <LoginForm>
        <h2>
          Log in to application
        </h2>

        <form onSubmit={handleLogin}>
          <FormRow>
            <Label>
              username

              <Input
                value={username}
                onChange={({ target }) =>
                  setUsername(
                    target.value
                  )
                }
              />
            </Label>
          </FormRow>

          <FormRow>
            <Label>
              password

              <Input
                type="password"
                value={password}
                onChange={({ target }) =>
                  setPassword(
                    target.value
                  )
                }
              />
            </Label>
          </FormRow>

          <Button type="submit">
            login
          </Button>
        </form>
      </LoginForm>
    )
  }

  const Create = () => {
    if (!user) {
      return (
        <Navigate to="/login" />
      )
    }

    return (
      <BlogForm
        createBlog={handleCreateBlog}
      />
    )
  }

  return (
    <Router>
      <div>
        <Navigation>
          <Link to="/">
            blogs
          </Link>

          {!user && (
            <Link to="/login">
              login
            </Link>
          )}

          {user && (
            <>
              <Link to="/create">
                create
              </Link>

              <UserInfo>
                {user.name ||
                  user.username}{' '}
                logged in
              </UserInfo>

              <button
                onClick={handleLogout}
              >
                logout
              </button>
            </>
          )}
        </Navigation>

        {notification && (
          <Notification>
            {notification.message}
          </Notification>
        )}

        <Routes>
          <Route
            path="/"
            element={<Blogs />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/create"
            element={<Create />}
          />

          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blogs={blogs}
                user={user}
                updateBlog={
                  handleUpdateBlog
                }
                removeBlog={
                  handleRemoveBlog
                }
              />
            }
          />

          <Route
            path="*"
            element={
              <h2>
                Page not found
              </h2>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App