import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        register: builder.mutation({
            query: credentials => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials
            })
        }),
        login: builder.mutation({
            query: credentials => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(`data: ${data}`)
                    dispatch(logOut())
                    dispatch(apiSlice.util.resetApiState())
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
                credentials: 'include'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log(data)
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (error) {
                    console.error(error)
                }
            }
        }),
        forgotPassword: builder.mutation({
            query: () => ({
                url: '/auth/forgot-password',
                method: 'POST',
                credentials: 'include'
            })
        }),
        resetPassword: builder.mutation({
            query: ({token, password}) => ({
                url: `/auth/reset-password/${token}`,
                method: 'POST',
                body: {password}
            })
        }),
    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation
} = authApiSlice