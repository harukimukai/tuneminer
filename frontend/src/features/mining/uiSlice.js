import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isMiningActive: false,
  isPrivateMode: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMiningActive: (state, action) => {
      state.isMiningActive = action.payload
    },
    setPrivateMode: (state, action) => {
      state.isPrivateMode = action.payload
    },
  }
})

export const { setMiningActive, setPrivateMode } = uiSlice.actions
export default uiSlice.reducer
