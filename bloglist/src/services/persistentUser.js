const storageKey = 'loggedBloglistUser'

const getUser = () => {
  const loggedUserJSON =
    window.localStorage.getItem(storageKey)

  if (!loggedUserJSON) {
    return null
  }

  return JSON.parse(loggedUserJSON)
}

const saveUser = user => {
  window.localStorage.setItem(
    storageKey,
    JSON.stringify(user)
  )
}

const removeUser = () => {
  window.localStorage.removeItem(storageKey)
}

export default {
  getUser,
  saveUser,
  removeUser
}