import { useNavigate } from 'react-router-dom'
import { useField, useAnecdotes } from '../hooks'

const CreateNew = () => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const { addAnecdote } = useAnecdotes()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })

    navigate('/')
  }

  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  const { reset: contentReset, ...contentInput } = content
  const { reset: authorReset, ...authorInput } = author
  const { reset: infoReset, ...infoInput } = info

  return (
    <div>
      <h2>create a new anecdote</h2>

      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentInput} />
        </div>

        <div>
          author
          <input {...authorInput} />
        </div>

        <div>
          url for more info
          <input {...infoInput} />
        </div>

        <button type="submit">create</button>

        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  )
}

export default CreateNew