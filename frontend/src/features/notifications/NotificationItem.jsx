import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import '../../css/notification/notificationItem.css'
import { useMarkAsReadMutation } from './notificationApiSlice'
dayjs.extend(relativeTime)

export const NotificationItem = ({allNotification}) => {
  const id = allNotification._id
  const [markAsRead] = useMarkAsReadMutation()
  const location = useLocation()
  const { sender, content, link, isRead, createdAt } = allNotification
  
  console.log(allNotification)

  return (
    <Link
      to={link || '/'}
      state={{ backgroundLocation: location }}
      className={`notification-item ${isRead ? 'read' : 'unread'}`}
      onClick={() => markAsRead(id)}
    >
      {/* {sender.icon ? (
        <img src={`http://localhost:3500/${sender.icon}`} alt="icon" className="notification-icon"/>  
      ) : (
        <img src='http://localhost:3000/default_user_icon.jpg' alt="icon" className="notification-icon"/>
      )}
      <img
        src={sender?.icon || '/default-user.png'}
        alt="user icon"
        className="notification-icon"
      /> */}
      <div className="notification-text-group">
        <div className="notification-content">
          {content}
        </div>
        <div className="notification-time">
          {dayjs(createdAt).fromNow()}
        </div>
      </div>
    </Link>
  )
}
