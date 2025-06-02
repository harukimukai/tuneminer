import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSocket } from './socketSlice';
import { conversationApiSlice } from './conversationApiSlice';

const useConversationSocket = () => {
  const dispatch = useDispatch();
  const socket = useSelector(selectSocket);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      console.log('[Socket] (Conversation) Message received:', message);

      // ConversationListだけ更新する！
      dispatch(
        conversationApiSlice.util.updateQueryData(
          'getAllConversations',
          undefined,
          (draft) => {
            const conv = draft.find(c => c._id === message.conversationId);
            if (conv) {
              conv.lastMessage = {
                text: message.content,
                sender: {
                  _id: message.sender._id,
                  username: message.sender.username,
                  icon: message.sender.icon,
                },
                timestamp: new Date().toISOString(),
              };
            }
          }
        )
      )
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, dispatch]);
};

export default useConversationSocket;
