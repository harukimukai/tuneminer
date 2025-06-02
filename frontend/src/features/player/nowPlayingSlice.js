import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentSong: null,         // { id, title, artist, audioUrl, imageUrl }
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  seekTime: null,
  volume: 0.5,
  pausedSnapshot: null,
  miningPlayer: {
    currentSong: null,
    isPlaying: false,
    diamondTime: null,
  }
}

const nowPlayingSlice = createSlice({
  name: 'nowPlaying',
  initialState,
  reducers: {
    setNowPlaying: (state, action) => {
      state.currentSong = action.payload
      state.currentTime = 0
      state.duration = 0
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload
    },
    setDuration: (state, action) => {
      state.duration = action.payload
    },
    stopPlaying: (state) => {
      state.currentSong = null
      state.isPlaying = false
      state.currentTime = 0
      state.duration = 0
    },
    setSeekTime: (state, action) => {
      state.seekTime = action.payload
    },
    setVolume: (state, action) => {
      state.volume = action.payload
    },
    setPausedSnapshot: (state, action) => {
      state.pausedSnapshot = action.payload;
    },
    clearPausedSnapshot: (state) => {
      state.pausedSnapshot = null;
    },
    setMiningSong: (state, action) => {
      state.miningPlayer.currentSong = action.payload.song;
      state.miningPlayer.diamondTime = action.payload.diamondTime;
      state.miningPlayer.isPlaying = true;
    },
    stopMiningSong: (state) => {
      state.miningPlayer.currentSong = null;
      state.miningPlayer.diamondTime = null;
      state.miningPlayer.isPlaying = false;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload
    }
  }
})

export const {
  setNowPlaying,
  togglePlay,
  setCurrentTime,
  setDuration,
  stopPlaying,
  setSeekTime,
  setVolume,
  clearPausedSnapshot,
  setIsPlaying,
  setPausedSnapshot
} = nowPlayingSlice.actions

export default nowPlayingSlice.reducer

export const selectNowPlaying = (state) => state.nowPlaying
