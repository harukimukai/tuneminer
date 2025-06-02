import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isMiningActive: false
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMiningActive: (state, action) => {
      state.isMiningActive = action.payload
    }
  }
})

export const { setMiningActive } = uiSlice.actions
export default uiSlice.reducer
