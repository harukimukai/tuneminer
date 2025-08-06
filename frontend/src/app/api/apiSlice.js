import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token

        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {

    // args = arguments

    console.log('args', args) // request url, method, body
    console.log('api', api) // signal, dispatch, getState()
    console.log('extraOptions', extraOptions) // custom like {shout: true}

    let result = await baseQuery(args, api, extraOptions)
    console.log('[baseQueryWithReauth] result:', result)

    // if you want, handle other status codes too
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        const state = api.getState()
        const token = state.auth.token

        // 未ログインなら refresh を試みない
        if (!token) {
            console.log('[baseQueryWithReauth] No token, not attempting refresh.')
            return result
        }

        // send refresh token to get new access token
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions) // args = '/auth/refresh'

        if (refreshResult?.data) {

            // store the new token
            api.dispatch(setCredentials({ ...refreshResult.data }))

            // retry original query with new access token
            result = await baseQuery(args, api, extraOptions)

        } else {

            if (refreshResult?.error?.status === 403) {

                refreshResult.error.data.message = 'Your login has expired.'

            }

            return refreshResult

        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Song', 'MiningHistory', 'PlayHistory', 'Followers', 'Followings'],
    endpoints: builder => ({})
})