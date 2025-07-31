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
      query: ({formData, id}) => ({
        url: `/playlists/${id}`,
        method: 'PATCH',
        body: formData
      }),
      invalidatesTags: ['Playlist'],
    }),
    addSongPlaylist: builder.mutation({
      query: ({playlistId, songId}) => ({
        url: `/playlists/${playlistId}/add`,
        method: 'PUT',
        body: {songId},
      }),
      invalidatesTags: ['Playlist'],
    }),
    removeSongPlaylist: builder.mutation({
      query: ({playlistId, songId}) => ({
        url: `/playlists/${playlistId}/remove`,
        method: 'PUT',
        body: {songId},
      }),
      invalidatesTags: ['Playlist'],
    }),
    getPlaylists: builder.query({
      query: () => '/playlists', 
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
  useAddSongPlaylistMutation,
  useRemoveSongPlaylistMutation,
  useGetMyPlaylistsQuery,
  useGetPlaylistByIdQuery,
  useDeletePlaylistMutation
} = playlistApiSlice
