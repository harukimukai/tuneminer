import { useGetNotificationsQuery, useMarkAsReadMutation } from './notificationApiSlice'
import { Link, useLocation } from 'react-router-dom'
import '../../css/notification.css'
import { useSelector } from 'react-redux'

const NotificationList = () => {
  const { data: notifications = [], isLoading, error } = useGetNotificationsQuery()
  const notificationsFromSocket = useSelector(state => state.notifications.list) // 👈 Socket追加分
  const [markAsRead] = useMarkAsReadMutation()
  const location = useLocation()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading notifications</p>

  // 結合（API + Socket）
  const allNotifications = [...notificationsFromSocket, ...notifications]

  return (
    <div>
      <h2>Notifications</h2>
      <ul className='notification-list'>
        {allNotifications.map((n) => (
          <li key={n._id} className={`notification-card ${n.isRead ? 'read' : 'unread'}`}>
            <div className={'notification-content'}>
              <p>
                <strong>{n.sender?.username || 'System'}</strong>: {n.content}
              </p>
              <Link to={n.link}
                state={{ backgroundLocation: location }} 
                className="view-link"
                onClick={() => markAsRead(n._id)}
              >
                ▶ View
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NotificationList
