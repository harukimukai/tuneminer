import { apiSlice } from "../../app/api/apiSlice"

export const playlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPlaylist: builder.mutation({
      query: (formData) => ({
        url: '/playlists',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Playlist'],
    }),
    updatePlaylist: builder.mutation({
      query: (data, playlistId) => ({
        url: `/playlists/${playlistId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Playlist'],
    }),
    getPlaylists: builder.query({
      query: () => '/playlists', // 必要なら /playlists/mine に変更可能
      providesTags: ['Playlist'],
    }),
    getMyPlaylists: builder.query({
      query: () => '/playlists/mine',
      providesTags: ['Playlist'],
    }),
    getPlaylistById: builder.query({
      query: (playlistId) => `/playlists/${playlistId}`,
      providesTags: (result, error, playlistId) => [{ type: 'Playlist', playlistId }],
    }),
    deletePlaylist: builder.mutation({
      query: (playlistId) => ({
          url: `/playlists/${playlistId}`,
          method: 'DELETE'
      }),
      invalidatesTags: ['Playlist']
    }),
  }),
})

export const {
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useGetMyPlaylistsQuery,
  useGetPlaylistByIdQuery,
  useDeletePlaylistMutation
} = playlistApiSlice
