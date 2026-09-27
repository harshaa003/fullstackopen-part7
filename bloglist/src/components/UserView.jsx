import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'

const Container = styled.div`
  max-width: 800px;
  margin: 30px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`

const UserName = styled.h2`
  margin-bottom: 25px;
  color: #1f2937;
`

const SectionTitle = styled.h3`
  margin-bottom: 15px;
  color: #374151;
`

const BlogList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const BlogItem = styled.li`
  margin-bottom: 10px;
  padding: 14px 16px;
  background: #f3f4f6;
  border-radius: 8px;
  border-left: 4px solid #2563eb;

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
  }

  a:hover {
    text-decoration: underline;
  }
`

const Message = styled.p`
  padding: 15px;
  background: #f3f4f6;
  border-radius: 8px;
  color: #555;
`

const ErrorMessage = styled.p`
  max-width: 800px;
  margin: 30px auto;
  padding: 15px;
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  color: #991b1b;
  font-weight: bold;
`

const UserView = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get(`/api/users/${id}`)
      .then((response) => {
        setUser(response.data)
      })
      .catch((error) => {
        console.error(error)
        setError('User not found')
      })
  }, [id])

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>
  }

  if (!user) {
    return <Message>Loading...</Message>
  }

  const blogs = Array.isArray(user.blogs) ? user.blogs : []

  return (
    <Container>
      <UserName>{user.name || user.username}</UserName>

      <SectionTitle>added blogs</SectionTitle>

      {blogs.length === 0 ? (
        <Message>No blogs added.</Message>
      ) : (
        <BlogList>
          {blogs.map((blog) => (
            <BlogItem key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </BlogItem>
          ))}
        </BlogList>
      )}
    </Container>
  )
}

export default UserView
