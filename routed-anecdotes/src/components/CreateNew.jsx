import { useNavigate } from 'react-router-dom'
import { useField, useAnecdotes } from '../hooks'

const CreateNew = () => {
  const navigate = useNavigate()
  const { addAnecdote } = useAnecdotes()

  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const submit = async (event) => {
    event.preventDefault()

    await addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })

    content.reset()
    author.reset()
    info.reset()

    navigate('/')
  }

  const reset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>

      <form onSubmit={submit}>
        <div>
          content
          <input {...content.inputProps} />
        </div>

        <div>
          author
          <input {...author.inputProps} />
        </div>

        <div>
          url for more info
          <input {...info.inputProps} />
        </div>

        <button type="submit">create</button>
        <button type="button" onClick={reset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew