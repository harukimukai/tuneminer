import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../../features/auth/authSlice'
import { useSendMessageMutation } from '../../features/messages/messageApiSlice'
import { useState } from 'react'
import { conversationApiSlice } from './conversationApiSlice'
import { selectSocket } from './socketSlice'

const MessageInput = ({ conversationId }) => {
  const socket = useSelector(selectSocket)
  const dispatch = useDispatch()
  const [text, setText] = useState('')
  const [sendMessage] = useSendMessageMutation()
  const currentUser = useSelector(selectCurrentUser) // ← これを追加！

  const handleSubmit = async (e) => {
    console.log('handleSubmit')
    e.preventDefault()
    if (!text.trim()) {
      return console.log('!text')
    }

    console.log('before try/catch')
    try {
      console.log('after try/catch')
      const savedMessage = await sendMessage({ 
        conversationId, 
        senderId: currentUser._id, 
        text 
      }).unwrap()
      setText('')

      console.log('savedMessage', savedMessage)

      // 🎯 メッセージ送ったら socket.io にも流す！
      if (socket) {
        console.log('socket.emit')
        socket.emit('sendMessage', {
          ...savedMessage,
          sender: {
            _id: currentUser._id,
            username: currentUser.username,
            icon: currentUser.icon,
          },
        })
      }

      // 送信成功したあとに入れる！
      console.log('dispatch start')
      dispatch(
        conversationApiSlice.util.updateQueryData(
          'getAllConversations',
          undefined,
          (draft) => {
            const conv = draft.find(c => c._id === conversationId);
            if (conv) {
              conv.lastMessage = {
                text: text, // 送ったメッセージ本文
                sender: {
                  _id: currentUser._id,
                  username: currentUser.username,
                  icon: currentUser.icon,
                },
                timestamp: new Date().toISOString(),
              };
            }
          }
        )
      )
    } catch (err) {
      console.error('Failed to send message:', err);
      if (err?.data) {
        console.error('Error data:', err.data);
      }
      if (err?.status) {
        console.error('Error status:', err.status);
      }
    }
  }

  return (
    <form 
      className='message-form flex' 
      style={
        { 
          display: 'flex',
          padding: '10px',
          backgroundColor: '#333',
          borderTop: '1px solid #555'
        }
      } 
      onSubmit={handleSubmit}
    >
      <div style={{ width: '100%'}}>
        <input
          style={{ backgroundColor:'gray', borderRadius: '8px' }}
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {text !== '' && (
          <button className='user-page-button' type="submit">Send</button>
        )
        }
      </div>
    </form>
  )
}

export default MessageInput
