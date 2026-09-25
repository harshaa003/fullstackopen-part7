import { Link } from 'react-router-dom'
import { useAnecdotes } from '../hooks'

const AnecdoteList = () => {
  const { anecdotes, deleteAnecdote } = useAnecdotes()

  return (
    <div>
      <h2>Anecdotes</h2>

      <ul>
        {anecdotes.map(anecdote => (
          <li key={anecdote.id}>
            <Link to={`/anecdotes/${anecdote.id}`}>
              {anecdote.content}
            </Link>

            <button onClick={() => deleteAnecdote(anecdote.id)}>
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AnecdoteList