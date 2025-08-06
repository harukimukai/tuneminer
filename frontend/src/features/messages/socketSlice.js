// src/features/socket/socketSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { io } from 'socket.io-client'
import { API_BASE_URL } from '../../config/constants'

const initialState = {
  socket: null,
}

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    connectSocket: (state) => {
      if (!state.socket) {
        const newSocket = io(`${API_BASE_URL}`, {
          withCredentials: true,
        })
        state.socket = newSocket
        console.log('[SocketSlice] Socket connected:', newSocket.id)
      }
    },
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect()
        console.log('[SocketSlice] Socket disconnected')
        state.socket = null
      }
    }
  }
})

export const { connectSocket, disconnectSocket } = socketSlice.actions

export default socketSlice.reducer

export const selectSocket = (state) => state.socket.socket
