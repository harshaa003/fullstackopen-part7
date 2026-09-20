import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

const UserView = () => {
  const [user, setUser] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    axios
      .get(`/api/users/${id}`)
      .then(response => {
        setUser(response.data)
      })
  }, [id])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>{user.name}</h2>

      <h3>added blogs</h3>

      {user.blogs.length === 0 ? (
        <p>This user has not added any blogs.</p>
      ) : (
        <ul>
          {user.blogs.map(blog => (
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