import { apiSlice } from '../../app/api/apiSlice'

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUserProfile: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }]
    }),
    updateUser: builder.mutation({
      query: ({ _id, formData }) => ({
        url: `/users/${_id}`,
        method: 'PATCH',
        body: formData
      }),
      invalidatesTags: ['User']
    }),
    followUser: builder.mutation({
      query: (targetUserId) => ({
        url: `/users/${targetUserId}/follow`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id}]
    }),
    getFollowingUsers: builder.query({
      query: (id) => `/users/${id}/following`
    }),
    getFollowers: builder.query({
      query: (id) => `/users/${id}/followers`
    })
  })
})

export const { 
  useGetUserProfileQuery,
  useUpdateUserMutation,
  useFollowUserMutation,
  useGetFollowingUsersQuery,
  useGetFollowersQuery
} = usersApiSlice
