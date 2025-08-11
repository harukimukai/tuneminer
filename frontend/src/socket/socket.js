import { io } from 'socket.io-client'
import { selectCurrentUser } from '../features/auth/authSlice'
import { API_BASE_URL } from '../config/constants'

let socket = null
let storeRef = null

export const initSocket = (store) => {
  storeRef = store
}

export const connectSocket = () => {
  if (!storeRef) {
    console.error('❌ [connectSocket] storeRef is not initialized!')
    return
  }

  const state = storeRef.getState()
  const currentUser = selectCurrentUser(state)

  if (currentUser && currentUser._id) {
    if (socket) socket.disconnect()

    socket = io(`${API_BASE_URL}`, {
      query: { userId: currentUser._id },
      withCredentials: true,
    })
  } else {
    console.log('❌ currentUser is missing or invalid')
  }
}

export const getSocket = () => socket

