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
    }),
    getMiningLikesBySong: builder.query({
      query: (songId) => `/mining-like/${songId}/by-song`,
      providesTags: [{type: 'MiningHistory'}]
    }),
    getMiningLikesByUser: builder.query({
      query: (userId) => `/mining-like/${userId}/by-user`,
      providesTags: ['MiningHistory']
    }),
    addMiningLike: builder.mutation({
      query: (songId) => ({
        url: `/mining-like/${songId}`,
        method: 'POST'
      }),
      invalidatesTags: ['MiningLike']
    }),
    removeMiningLike: builder.mutation({
      query: (songId) => ({
        url: `/miningLike/${songId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MiningLike']
    }),
  })
})

export const {
  useRecordMiningMutation,
  useGetMyMiningHistoryQuery,
  useGetMiningLikesBySongQuery,
  useGetMiningLikesByUserQuery,
  useAddMiningLikeMutation,
  useRemoveMiningLikeMutation
} = miningApiSlice