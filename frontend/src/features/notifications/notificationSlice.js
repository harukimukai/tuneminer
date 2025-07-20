import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    unreadCount: 0,
  },
  reducers: {
    addNotification: (state, action) => {
      state.list.unshift(action.payload) // 新しい通知を上に
    },
    setNotifications: (state, action) => {
      state.list = action.payload
    },
    clearNotifications: (state) => {
      state.list = []
    },
  },
})

export const { addNotification, setNotifications, clearNotifications } =
  notificationSlice.actions

export default notificationSlice.reducer
