import { create } from 'zustand'

const useNotificationStore = create((set) => ({
  notification: null,

  setNotification: (message, type = 'success') => {
    set({
      notification: {
        message,
        type
      }
    })

    setTimeout(() => {
      set({
        notification: null
      })
    }, 5000)
  },

  clearNotification: () => {
    set({
      notification: null
    })
  }
}))

export default useNotificationStore