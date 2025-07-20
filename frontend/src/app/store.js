import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from './api/apiSlice'
import { setupListeners } from "@reduxjs/toolkit/query"
import authReducer from '../features/auth/authSlice'
import nowPlayingReducer from "../features/player/nowPlayingSlice"
import messageReducer from '../features/messages/messageSlice'
import socketReducer from "../features/messages/socketSlice"
import uiReducer from "../features/mining/uiSlice"
import notificationReducer from "../features/notifications/notificationSlice"
import { genreApi } from "../features/songs/genreApi"
import { initSocket } from "../socket/socket"

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [genreApi.reducerPath]: genreApi.reducer,
    auth: authReducer,
    nowPlaying: nowPlayingReducer,
    message: messageReducer,
    socket: socketReducer,
    notifications: notificationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiSlice.middleware,
      genreApi.middleware
    ),
  devTools: true,
})

initSocket(store) // ✅ ここで store を注入
setupListeners(store.dispatch)