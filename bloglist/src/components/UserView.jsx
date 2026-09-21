import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

const UserView = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get(`/api/users/${id}`)
      .then(response => {
        setUser(response.data)
      })
      .catch(error => {
        console.error(error)
        setError('User not found')
      })
  }, [id])

  if (error) {
    return <div>{error}</div>
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const blogs = Array.isArray(user.blogs)
    ? user.blogs
    : []

  return (
    <div>
      <h2>{user.name || user.username}</h2>

      <h3>added blogs</h3>

      {blogs.length === 0 ? (
        <p>No blogs added.</p>
      ) : (
        <ul>
          {blogs.map(blog => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UserView