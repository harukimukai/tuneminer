import { apiSlice } from '../../app/api/apiSlice'

export const songApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadSong: builder.mutation({
        query: (formData) => ({
            url: '/songs',
            method: 'POST',
            body: formData
        })
    }),
    getAllSongs: builder.query({
        query: () => '/songs',
        providesTags: ['Song']
    }),
    getMySongs: builder.query({
        query: () => '/songs/user',
        providesTags: ['Song']
    }),
    getSongById: builder.query({
        query: (id) => `/songs/${id}`,
        providesTags: (result, error, id) => [{ type: 'Song', id}]
    }),
    updateSong: builder.mutation({
        query: ({ id, formData }) => ({
            url: `/songs/${id}`,
            method: 'PATCH',
            body: formData
        }),
        invalidatesTags: ['Song']
    }),
    deleteSong: builder.mutation({
        query: (id) => ({
            url: `/songs/${id}`,
            method: 'DELETE'
        }),
        invalidatesTags: ['Song']
    }),
    toggleLike: builder.mutation({
        query: (id) => ({
            url: `/songs/${id}/like`,
            method: 'PATCH'
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Song', id}]
    }),
    getLikedSongs: builder.query({
        query: () => '/songs/liked',
        providesTags: ['Song']
    }),
    searchSongs: builder.query({
        query: (params) => {
            const queryString = new URLSearchParams(params).toString()
            return `/songs/search-results?${queryString}`
        }
    }),
    playSong: builder.mutation({
        query: (songId) => ({
            url: `/songs/${songId}/play`,
            method: 'POST',
            credentials: 'include'
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Song', id}]
    }),
    getRecommendations: builder.query({
        query: (userId) => `/songs/recommend/${userId}`
    }),
    getMiningSongs: builder.query({
        query: () => '/songs/mining',
        providesTags: ['Song']
    }),
    toggleAdminRecom: builder.mutation({
        query: (songId) => ({
            url: `/songs/admin-recommend/${songId}`,
            method: 'PATCH'
        }),
        invalidatesTags: ['Song']
    }),
    getAdminRec: builder.query({
        query: () => '/songs/admin-recommended',
        providesTags: ['Song']
    })
  })
})

export const {
  useUploadSongMutation,
  useGetMySongsQuery,
  useGetAllSongsQuery,
  useGetSongByIdQuery,
  useDeleteSongMutation,
  useUpdateSongMutation,
  useToggleLikeMutation,
  useGetLikedSongsQuery,
  useSearchSongsQuery,
  usePlaySongMutation,
  useGetRecommendationsQuery,
  useGetMiningSongsQuery,
  useToggleAdminRecomMutation,
  useGetAdminRecQuery
} = songApiSlice

export const songApi = songApiSlice