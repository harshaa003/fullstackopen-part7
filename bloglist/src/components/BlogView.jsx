import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'

const Container = styled.div`
  max-width: 800px;
  margin: 30px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`

const BlogTitle = styled.h2`
  color: #2563eb;
`

const BlogInfo = styled.p`
  color: #555;
`

const Button = styled.button`
  padding: 8px 14px;
  margin: 5px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`

const RemoveButton = styled(Button)`
  background: #dc2626;

  &:hover {
    background: #b91c1c;
  }
`

const CommentsSection = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #ddd;
`

const CommentForm = styled.form`
  display: flex;
  gap: 10px;
  margin: 15px 0;
`

const CommentInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
`

const CommentList = styled.ul`
  padding-left: 20px;
`

const Comment = styled.li`
  margin: 8px 0;
  padding: 8px;
  background: #f3f4f6;
  border-radius: 6px;
`

const BlogView = ({
  blogs,
  likeBlog,
  removeBlog,
  user
}) => {
  const [blog, setBlog] = useState(null)
  const [newComment, setNewComment] = useState('')

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const foundBlog = blogs.find(
      blog => blog.id === id
    )

    if (foundBlog) {
      setBlog(foundBlog)
    }
  }, [blogs, id])

  if (!blog) {
    return <div>Loading...</div>
  }

  const handleLike = async () => {
    if (!likeBlog) {
      console.error(
        'likeBlog prop is missing'
      )
      return
    }

    try {
      const updatedBlog =
        await likeBlog(blog)

      if (updatedBlog) {
        setBlog(updatedBlog)
      }
    } catch (error) {
      console.error(
        'Liking blog failed:',
        error
      )
    }
  }

  const handleRemove = async () => {
    if (!user) {
      alert('You must be logged in')
      return
    }

    if (
      window.confirm(
        `Remove blog ${blog.title}?`
      )
    ) {
      try {
        await removeBlog(blog.id)
        navigate('/')
      } catch (error) {
        console.error(
          'Removing blog failed:',
          error
        )
      }
    }
  }

  const handleComment = async event => {
    event.preventDefault()

    if (!newComment.trim()) {
      return
    }

    try {
      const response =
        await axios.post(
          `/api/blogs/${blog.id}/comments`,
          {
            comment:
              newComment.trim()
          }
        )

      setBlog(response.data)
      setNewComment('')
    } catch (error) {
      console.error(
        'Adding comment failed:',
        error
      )

      alert(
        error.response?.data?.error ||
          'Adding comment failed'
      )
    }
  }

  return (
    <Container>
      <BlogTitle>
        {blog.title}
      </BlogTitle>

      <BlogInfo>
        <strong>URL:</strong>{' '}
        <a
          href={blog.url}
          target="_blank"
          rel="noreferrer"
        >
          {blog.url}
        </a>
      </BlogInfo>

      <BlogInfo>
        <strong>Author:</strong>{' '}
        {blog.author}
      </BlogInfo>

      <BlogInfo>
        <strong>Likes:</strong>{' '}
        {blog.likes}

        <Button
          onClick={handleLike}
        >
          like
        </Button>
      </BlogInfo>

      <BlogInfo>
        <strong>Added by:</strong>{' '}
        {blog.user?.name ||
          blog.author}
      </BlogInfo>

      {user && (
        <RemoveButton
          onClick={handleRemove}
        >
          remove
        </RemoveButton>
      )}

      <CommentsSection>
        <h3>comments</h3>

        <CommentForm
          onSubmit={handleComment}
        >
          <CommentInput
            value={newComment}
            onChange={event =>
              setNewComment(
                event.target.value
              )
            }
            placeholder="write a comment"
          />

          <Button type="submit">
            add comment
          </Button>
        </CommentForm>

        {blog.comments &&
        blog.comments.length > 0 ? (
          <CommentList>
            {blog.comments.map(
              (comment, index) => (
                <Comment
                  key={index}
                >
                  {comment}
                </Comment>
              )
            )}
          </CommentList>
        ) : (
          <p>No comments yet.</p>
        )}
      </CommentsSection>
    </Container>
  )
}

export default BlogView