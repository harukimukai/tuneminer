import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from './api/apiSlice'
import { setupListeners } from "@reduxjs/toolkit/query"
import authReducer from '../features/auth/authSlice'
import nowPlayingReducer from "../features/player/nowPlayingSlice"
import messageReducer from '../features/messages/messageSlice'
import socketReducer from "../features/messages/socketSlice"
import uiReducer from "../features/mining/uiSlice"
import { genreApi } from "../features/songs/genreApi"

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [genreApi.reducerPath]: genreApi.reducer, // ← これを追加！
        auth: authReducer,
        nowPlaying: nowPlayingReducer,
        message: messageReducer,
        socket: socketReducer,
        ui: uiReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({serializableCheck: false})
            .concat(
                apiSlice.middleware,
                genreApi.middleware 
            ),
    devTools: true
})

setupListeners(store.dispatch)