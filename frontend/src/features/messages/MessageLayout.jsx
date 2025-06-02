import { useState } from 'react'
import ConversationList from './ConversationList'
import MessageThread from './MessageThread'

const MessageLayout = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null)

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId)
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <ConversationList onSelectConversation={handleSelectConversation} />
      </div>
      <div style={{ width: '70%'}}>
        {selectedConversationId ? (
          <MessageThread conversationId={selectedConversationId} />
        ) : (
          <p style={{ padding: '1rem' }}>Select a conversation</p>
        )}
      </div>
    </div>
  )
}

export default MessageLayout
