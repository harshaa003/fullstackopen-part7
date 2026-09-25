import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService
      .getAll()
      .then(data => setAnecdotes(data))
  }, [])

  const addAnecdote = async (newAnecdote) => {
    const createdAnecdote =
      await anecdoteService.createNew(newAnecdote)

    setAnecdotes(anecdotes =>
      anecdotes.concat(createdAnecdote)
    )
  }

  const deleteAnecdote = async (id) => {
    await anecdoteService.remove(id)

    setAnecdotes(anecdotes =>
      anecdotes.filter(anecdote => anecdote.id !== id)
    )
  }

  return {
    anecdotes,
    addAnecdote,
    deleteAnecdote
  }
}