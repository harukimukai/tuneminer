import { apiSlice } from "../../app/api/apiSlice";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query({
      query: () => '/notifications',
      providesTags: ['Notifications']
    }),
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notifications']
    })
  })
})


export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation
} = notificationApiSlice