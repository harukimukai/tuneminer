import { apiSlice } from '../../app/api/apiSlice'

export const playHistoryApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    recordPlayHistory: builder.mutation({
      query: (songId) => ({
        url: `/play-history/${songId}`,
        method: 'POST',
        body: {songId}
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'PlayHistory', id: 'LIST' }
      ]
    }),
    getMyPlayHistory: builder.query({
      query: (userId) => `/play-history/${userId}`,
      providesTags: (result, error, arg) => [
        { type: 'PlayHistory', id: 'LIST' }
      ]
    })
  })
})

export const {
  useRecordPlayHistoryMutation,
  useGetMyPlayHistoryQuery
} = playHistoryApiSlice