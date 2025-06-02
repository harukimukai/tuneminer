// features/messages/messageApiSlice.js
import { apiSlice } from '../../app/api/apiSlice'
import { conversationApiSlice } from './conversationApiSlice'

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMessagesByConversationId: builder.query({
      query: (conversationId) => `/messages/conversation/${conversationId}`,  // ✅ ルートに合わせる！
      providesTags: (result, error, conversationId) => [
        { type: 'Message', id: conversationId }
      ]
    }),    
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: '/messages',
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'Message', id: conversationId }
      ]
    }),
    markMessagesAsRead: builder.mutation({
      query: (conversationId) => ({
        url: `/messages/read/${conversationId}`,
        method: 'PATCH',
      }),
      async onQueryStarted(conversationId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(
            conversationApiSlice.util.updateQueryData(
              'getUnreadCounts',
              undefined,
              (draft) => {
                delete draft[conversationId] // delete  unreadCount
              }
            )
          )
        } catch (err) {
          console.error('Failed to mark as read:', err)
        }
      }
    })
  })
})

export const {
  useGetMessagesByConversationIdQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation
} = messageApiSlice
