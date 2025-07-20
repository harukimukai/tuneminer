import { getSocket } from "../../socket/socket"
import { addNotification } from "./notificationSlice"

export const initNotificationListener = (dispatch) => {
  const socket = getSocket()
  if (!socket) return

  socket.on('newNotification', (notification) => {
    console.log('📨 新しい通知:', notification)
    dispatch(addNotification(notification))
  })
}