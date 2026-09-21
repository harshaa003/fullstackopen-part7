import { Link } from 'react-router-dom'
import styled from 'styled-components'

const BlogContainer = styled.div`
  background: white;
  padding: 18px;
  border-radius: 10px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

const BlogTitle = styled(Link)`
  font-size: 18px;
  color: #1f2937;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const BlogAuthor = styled.span`
  color: #6b7280;
  margin-left: 5px;
`

const ViewLink = styled(Link)`
  margin-left: 15px;
  color: #2563eb;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`

const Blog = ({ blog, likeBlog }) => {
  return (
    <BlogContainer className="blog">
      <div>
        <BlogTitle
          className="blog-title"
          to={`/blogs/${blog.id}`}
        >
          {blog.title}
        </BlogTitle>{' '}

        <BlogAuthor className="blog-author">
          {blog.author}
        </BlogAuthor>

        <ViewLink to={`/blogs/${blog.id}`}>
          view
        </ViewLink>
      </div>

      <div style={{ marginTop: '12px' }}>
        <span>
          likes {blog.likes}
        </span>

        <button
          onClick={() => likeBlog(blog)}
          style={{
            marginLeft: '10px',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '5px',
            background: '#2563eb',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          like
        </button>
      </div>
    </BlogContainer>
  )
}

export default Blog