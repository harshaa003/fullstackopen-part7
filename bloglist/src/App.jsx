import { useEffect, useState } from 'react'
import {
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom'
import styled from 'styled-components'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import UserView from './components/UserView'
import ErrorBoundary from './ErrorBoundary'
import axios from 'axios'
import useNotificationStore from './stores/notificationStore'
import useBlogStore from './stores/blogStore'
import useUserStore from './stores/userStore'
import persistentUser from './services/persistentUser'
import { useField } from './hooks'

const Page = styled.div`
  min-height: 100vh;
  background: #f4f6f8;
  color: #222;
`

const Navigation = styled.nav`
  background: #1f2937;
  padding: 18px 30px;
  display: flex;
  align-items: center;
  gap: 20px;

  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }

  a:hover {
    color: #60a5fa;
  }

  button {
    padding: 8px 14px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background: #dc2626;
    color: white;
    font-weight: bold;
  }
`

const Main = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
`

const UserInfo = styled.span`
  color: #d1d5db;
  margin-left: auto;
`

const Notification = styled.div`
  max-width: 1000px;
  margin: 20px auto;
  padding: 14px 18px;
  border-radius: 8px;
  background: #dcfce7;
  border: 1px solid #86efac;
  color: #166534;
  font-weight: bold;
`

const LoginForm = styled.div`
  background: white;
  padding: 30px;
  margin: 30px auto;
  border-radius: 12px;
  max-width: 450px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`

const FormRow = styled.div`
  margin-bottom: 18px;
`

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-weight: bold;
  gap: 7px;
`

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #bbb;
  border-radius: 6px;
  font-size: 16px;
`

const Button = styled.button`
  padding: 9px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  background: #2563eb;
  color: white;
  font-weight: bold;
`

const PageTitle = styled.h2`
  color: #1f2937;
  margin-bottom: 20px;
`

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;

  th,
  td {
    padding: 14px 16px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background: #1f2937;
    color: white;
  }

  a {
    color: #2563eb;
    text-decoration: none;
  }
`
const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get('/api/users').then(response => {
      setUsers(response.data)
    })
  }, [])

  return (
    <div>
      <PageTitle>users</PageTitle>

      <UserTable>
        <thead>
          <tr>
            <th>User</th>
            <th>Blogs created</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>
                  {user.name || user.username}
                </Link>
              </td>

              <td>
                {Array.isArray(user.blogs)
                  ? user.blogs.length
                  : 0}
              </td>
            </tr>
          ))}
        </tbody>
      </UserTable>
    </div>
  )
}
const Login = ({
  user,
  username,
  password,
  handleLogin
}) => {
  if (user) {
    return <Navigate to="/" />
  }

  return (
    <LoginForm>
      <h2>Log in to application</h2>

      <form onSubmit={handleLogin}>
        <FormRow>
          <Label>
            Username
            <Input {...username.inputProps} />
          </Label>
        </FormRow>

        <FormRow>
          <Label>
            Password
            <Input {...password.inputProps} />
          </Label>
        </FormRow>

        <Button type="submit">
          login
        </Button>
      </form>
    </LoginForm>
  )
}

const App = () => {
  const username = useField('text')
  const password = useField('password')

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
    const savedUser = persistentUser.getUser()

    if (savedUser) {
      setUser(savedUser)
    }
  }, [setUser])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const response = await axios.post(
        '/api/login',
        {
          username: username.value,
          password: password.value
        }
      )

      const loggedUser = response.data

      persistentUser.saveUser(loggedUser)
      setUser(loggedUser)

      username.reset()
      password.reset()

      setNotification(
        `Welcome ${
          loggedUser.name || loggedUser.username
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
    persistentUser.removeUser()
    clearUser()

    setNotification(
      'Logged out successfully',
      'success'
    )
  }

  const handleCreateBlog = async blog => {
    try {
      const createdBlog = await createBlog(
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

      throw new Error('Adding blog failed')
    }
  }

  const handleUpdateBlog = async (
    updatedBlog,
    id
  ) => {
    try {
      return await updateBlog(
        id,
        updatedBlog,
        user.token
      )
    } catch {
      setNotification(
        'Updating the blog failed',
        'error'
      )

      throw new Error('Updating blog failed')
    }
  }

  const handleLikeBlog = async blog => {
    try {
      await likeBlog(
        blog.id,
        blog,
        user.token
      )

      setNotification(
        'Blog liked',
        'success'
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
      <PageTitle>blogs</PageTitle>

      {blogs
        .slice()
        .sort(
          (a, b) =>
            b.likes - a.likes
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

  const Create = () => {
    if (!user) {
      return <Navigate to="/login" />
    }

    return (
      <BlogForm
        createBlog={handleCreateBlog}
      />
    )
  }

  return (
    <Page>
      <Navigation>
        <Link to="/">
          blogs
        </Link>

        <Link to="/users">
          users
        </Link>

        {!user && (
          <Link to="/login">
            login
          </Link>
        )}

        {user && (
          <>
            <Link to="/create">
              new blog
            </Link>

            <UserInfo>
              {user.name ||
                user.username}{' '}
              logged in
            </UserInfo>

            <button onClick={handleLogout}>
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

      <Main>
        <ErrorBoundary>
          <Routes>
            <Route
              path="/"
              element={<Blogs />}
            />

            <Route
              path="/users"
              element={<Users />}
            />

            <Route
              path="/users/:id"
              element={<UserView />}
            />

            <Route
              path="/login"
              element={
                <Login
                  user={user}
                  username={username}
                  password={password}
                  handleLogin={handleLogin}
                />
              }
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
                  likeBlog={handleLikeBlog}
                  updateBlog={handleUpdateBlog}
                  removeBlog={handleRemoveBlog}
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
        </ErrorBoundary>
      </Main>
    </Page>
  )
}

export default App