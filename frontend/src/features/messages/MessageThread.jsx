
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import MessageInput from './MessageInput'
import { useGetMessagesByConversationIdQuery, useMarkMessagesAsReadMutation } from './messageApiSlice'
import '../../css/messageThread.css'
import { useEffect, useRef } from 'react'
import useMessageSocket from './useMessageSocket'

const MessageThread = ({ conversationId }) => {
  useMessageSocket(conversationId)

  const currentUser = useSelector(selectCurrentUser)
  const { 
    data: messages = [], 
    isLoading, 
    error,
    refetch
  } = useGetMessagesByConversationIdQuery(conversationId)

  const [markMessagesAsRead] = useMarkMessagesAsReadMutation()

  const bottomRef = useRef(null)
  
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // 🎯 conversationIdが切り替わったら、手動でrefetchする
  useEffect(() => {
    if (conversationId) {
      console.log('[MessageThread] Conversation changed, refetching...');
      refetch();
    }
  }, [conversationId, refetch])

  useEffect(() => {
    if (conversationId) {
      console.log('[MessageThread] Marking messages as read:', conversationId);
      markMessagesAsRead(conversationId);
    }
  }, [conversationId, markMessagesAsRead])

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading messages.</p>

  return (
    <div className="message-thread">
      <div className="message-list">
        {[...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map(msg => {
          const isSelf = (typeof msg.sender === 'object' ? msg.sender._id : msg.sender) === currentUser._id

          return (
            <div
              key={msg._id}
              className={`message-item ${isSelf ? 'self' : 'other'}`}
              ref={bottomRef}
            >
              <div className="message-content">
                <strong>{msg.sender.username}: </strong> {msg.content}
              </div>
            </div>
          )
        })}
      </div>
      <MessageInput conversationId={conversationId} />
    </div>
  )
}

export default MessageThread
