import { apiSlice } from '../../app/api/apiSlice'

export const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createReportSong: builder.mutation({
      query: ({songId, data}) => ({
        url: `/report/song`,
        method: 'POST',
        body: {songId, data}
      }),
      invalidatesTags: ['ReportSong']
    }),
    createReportUser: builder.mutation({
      query: ({userId, data}) => ({
        url: `/report/user`,
        method: 'POST',
        body: {reportedId: userId, data}
      }),
      invalidatesTags: ['ReportUser']
    }),
    getSongReports: builder.query({
      query: () => '/report/song',
      providesTags: ['ReportSong']
    }),
    getUserReports: builder.query({
      query: () => '/report/user',
      providesTags: ['ReportUser']
    }),
    getOneSongReport: builder.query({
      query: (songId) => `/report/song/${songId}`,
      providesTags: ['ReportSong']
    }),
    getOneUserReport: builder.query({
      query: (userId) => `/report/user/${userId}`,
      providesTags: ['ReportUser']
    }),
    dealSongReport: builder.mutation({
      query: (songId) => ({
        url: `/report/song/${songId}`,
        method: 'PATCH'
      }),
      invalidatesTags: ['ReportSong']
    }),
    dealUserReport: builder.mutation({
      query: (userId) => ({
        url: `/report/user/${userId}`,
        method: 'PATCH'
      }),
      invalidatesTags: ['ReportUser']
    }),
  })
})

export const {
  useCreateReportSongMutation,
  useCreateReportUserMutation,
  useGetSongReportsQuery,
  useGetUserReportsQuery,
  useGetOneSongReportQuery,
  useGetOneUserReportQuery,
  useDealSongReportMutation,
  useDealUserReportMutation
} = reportApiSlice