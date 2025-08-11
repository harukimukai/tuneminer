import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import { selectSocket } from './socketSlice';
import { conversationApiSlice } from './conversationApiSlice';

const useGlobalMessageSocket = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const socket = useSelector(selectSocket);

  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleReceiveMessage = (message) => {
      if (message.sender._id === currentUser._id) return;

      dispatch(
        conversationApiSlice.util.updateQueryData(
          'getUnreadCounts',
          undefined,
          (draft) => {
            const convId = message.conversationId;
            if (!draft[convId]) {
              draft[convId] = 1;
            } else {
              draft[convId] += 1;
            }
          }
        )
      );

      // ✅ lastMessage を更新（会話一覧用）
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
      );
    };

    socket.on('receiveMessage', handleReceiveMessage);
    return () => socket.off('receiveMessage', handleReceiveMessage);
  }, [socket, dispatch, currentUser]);
};

export default useGlobalMessageSocket;
