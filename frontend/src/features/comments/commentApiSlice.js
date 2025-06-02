import { apiSlice } from '../../app/api/apiSlice'

export const commentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCommentsBySong: builder.query({
            query: (songId) => `/comments/${songId}`,
            providesTags: (result, error, songId) => [{ type: 'Comment', id: songId }]
        }),
        createComment: builder.mutation({
            query: ({ songId, content, parent }) => ({
            url: '/comments',
            method: 'POST',
            body: { songId, content, parent }
        }),
        invalidatesTags: (result, error, { songId }) => [{ type: 'Comment', id: songId }]
        }),
        deleteComment: builder.mutation({
            query: (commentId) => ({
                url: `/comments/${commentId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, commentId) => [{ type: 'Comment'}]
        })
    })
  })
  
export const {
    useGetCommentsBySongQuery,
    useCreateCommentMutation,
    useDeleteCommentMutation
} = commentApiSlice