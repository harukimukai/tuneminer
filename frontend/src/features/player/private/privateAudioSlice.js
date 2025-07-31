import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentPrivateSong: null,         // { id, title, artist, audioUrl, imageUrl }
  privateIsPlaying: false,
  privateCurrentTime: 0,
  privateDuration: 0,
  privateSeekTime: null
}

const privateAudioSlice = createSlice({
  name: 'privateAudio',
  initialState,
  reducers: {
    setCurrentPrivateSong: (state, action) => {
      state.currentPrivateSong = action.payload
      state.privateCurrentTime = 0
      state.privateDuration = 0
    },
    privateTogglePlay: (state) => {
      state.privateIsPlaying = !state.privateIsPlaying
    },
    setPrivateCurrentTime: (state, action) => {
      state.privateCurrentTime = action.payload
    },
    setPrivateDuration: (state, action) => {
      state.privateDuration = action.payload
    },
    privateStopPlaying: (state) => {
      state.currentPrivateSong = null
      state.privateIsPlaying = false
      state.privateCurrentTime = 0
      state.privateDuration = 0
    },
    setPrivateSeekTime: (state, action) => {
      state.privateSeekTime = action.payload
    },
    setPrivateIsPlaying: (state, action) => {
      state.privateIsPlaying = action.payload
    }
  }
})

export const {
  setCurrentPrivateSong,
  privateTogglePlay,
  setPrivateCurrentTime,
  setPrivateDuration,
  privateStopPlaying,
  setPrivateSeekTime,
  setPrivateIsPlaying
} = privateAudioSlice.actions

export default privateAudioSlice.reducer

export const selectPrivateAudio = (state) => state.privateAudio
