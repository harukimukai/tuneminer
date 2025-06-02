import { apiSlice } from '../../app/api/apiSlice'

export const miningApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    recordMining: builder.mutation({
      query: (songId) => ({
        url: '/mining-history',
        method: 'POST',
        body: {songId}
      }),
      invalidatesTags: ['MiningHistory']
    }),
    getMyMiningHistory: builder.query({
      query: () => '/mining-history',
      providesTags: ['MiningHistory']
    })
  })
})

export const {
  useRecordMiningMutation,
  useGetMyMiningHistoryQuery
} = miningApiSlice