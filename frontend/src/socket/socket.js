import { io } from 'socket.io-client'
import { selectCurrentUser } from '../features/auth/authSlice'

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

  console.log('🧪 [connectSocket] currentUser:', currentUser)

  if (currentUser && currentUser._id) {
    if (socket) socket.disconnect()

    socket = io('http://localhost:3500', {
      query: { userId: currentUser._id },
      withCredentials: true,
    })

    console.log('✅ socket connected with userId:', currentUser._id)
  } else {
    console.log('❌ currentUser is missing or invalid')
  }
}

export const getSocket = () => socket

