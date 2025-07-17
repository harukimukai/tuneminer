import { apiSlice } from "../../app/api/apiSlice";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query({
      query: () => '/notifications',
      providesTags: ['Notifications']
    })
  })
})


export const {
  useGetNotificationsQuery
} = notificationApiSlice