import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null, 
        token: null,
        checked: false
    },
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload
                if (user) {
                state.user = user
                state.token = accessToken
                state.checked = true
            }
        },
        setChecked: (state, action) => {
            state.checked = action.payload // true/false 両方に使える
        },
        logOut: (state) => {
            state.user = null
            state.token = null
            state.checked = true
        }
    }
})

export const { setCredentials, logOut, setChecked } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectAuthChecked = (state) => state.auth.checked