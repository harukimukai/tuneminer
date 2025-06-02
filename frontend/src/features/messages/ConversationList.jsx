import { useGetAllConversationsQuery, useGetUnreadCountsQuery } from './conversationApiSlice'
import '../../css/conversationList.css'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'

const ConversationList = ({ onSelectConversation }) => {
  const { data: conversations, isLoading, error } = useGetAllConversationsQuery()
  const { data: unreadCounts = {} } = useGetUnreadCountsQuery()
  console.log('unreadCounts: ', unreadCounts)
  const currentUser = useSelector(selectCurrentUser)

  if (isLoading) return <p>Loading conversations...</p>
  if (error) return <p>Error loading conversations.</p>

  return (
    <div className='conversation-list'>
      {conversations.map(conv => {
        const unreadCount = unreadCounts[conv._id.toString()] || 0;
        const otherParticipants = conv.participants.filter(p => p._id !== currentUser._id)

        return (
          <div
            key={conv._id}
            style={{ 
              padding: '0.5rem',
              cursor: 'pointer',
              borderBottom: '1px solid #ccc',
              position: 'relative' // ✅ バッジの位置指定に必要！
            }}
            onClick={() => onSelectConversation(conv._id)}
          >
            {otherParticipants.map(p => p.username).join(', ')}
            <div className="last-message">
              {conv.lastMessage?.sender.username}: {conv.lastMessage?.text || 'No messages yet'}
            </div>

            {/* ✅ 正しい未読バッジ表示 */}
            {unreadCount > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {unreadCount}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ConversationList
