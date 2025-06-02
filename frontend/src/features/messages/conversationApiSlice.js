// features/messages/conversationApiSlice.js
import { apiSlice } from '../../app/api/apiSlice'

// backend route '/conversations/'
export const conversationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getAllConversations: builder.query({
        query: () => '/conversations',
        providesTags: ['Conversations'],
      }),
      getConversationById: builder.query({
        query: (id) => `/conversations/${id}`,
        providesTags: (result, error, id) => [{ type: 'Conversations', id }],
      }),
      createConversation: builder.mutation({
        query: (recipientId) => ({
          url: '/conversations',
          method: 'POST',
          body: {recipientId},
        }),
        invalidatesTags: ['Conversations'],
      }),
      getUnreadCounts: builder.query({
        query: () =>  '/conversations/unread-counts'
      })
    }),
  })
  

export const {
  useGetAllConversationsQuery,
  useCreateConversationMutation,
  useGetConversationByIdQuery,
  useGetUnreadCountsQuery
} = conversationApiSlice
