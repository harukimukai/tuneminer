import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { messageApiSlice } from './messageApiSlice'
import { conversationApiSlice } from './conversationApiSlice'
import { selectCurrentUser } from '../auth/authSlice'
import { selectSocket } from './socketSlice'

const useMessageSocket = (conversationId) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const socket = useSelector(selectSocket)

  useEffect(() => {
    if (!socket) return

    const handleReceiveMessage = (message) => {

      const isCurrentConversation = (message.conversationId === conversationId)

      if (isCurrentConversation) {
        if (message.sender._id === currentUser._id) {
          return
        }
    
        dispatch(
          messageApiSlice.util.updateQueryData(
            'getMessagesByConversationId',
            conversationId,
            (draft) => {
              draft.push(message)
            }
          )
        )
      } else {
        // ✅ 未読カウント増やす（別会話の場合のみ）
        dispatch(
          conversationApiSlice.util.updateQueryData(
            'getUnreadCounts',
            undefined,
            (draft) => {
              const convId = message.conversationId
              if (!draft[convId]) {
                draft[convId] = 1
              } else {
                draft[convId] += 1
              }
            }
          )
        )
      }
      
      dispatch(
        conversationApiSlice.util.updateQueryData(
          'getAllConversations',
          undefined,
          (draft) => {
            const conv = draft.find(c => c._id === message.conversationId)
            if (conv) {
              conv.lastMessage = {
                text: message.content,
                sender: {
                  _id: message.sender._id,
                  username: message.sender.username,
                  icon: message.sender.icon,
                },
                timestamp: new Date().toISOString(),
              }
            }
          }
        )
      )
    }

    socket.on('receiveMessage', handleReceiveMessage)

    return () => {
      socket.off('receiveMessage', handleReceiveMessage)
    }
  }, [socket, dispatch, conversationId])
}

export default useMessageSocket