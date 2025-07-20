import React from 'react'
import { useGetNotificationsQuery } from './notificationApiSlice'
import { useSelector } from 'react-redux'
import { NotificationItem } from './NotificationItem'
import { Link } from 'react-router-dom'

export const NotificationDropdown = () => {
  const { data: notifications = [], isLoading, error } = useGetNotificationsQuery()
  const notificationsFromSocket = useSelector(state => state.notifications.list) // 👈 Socket追加分
  const allNotifications = [...notificationsFromSocket, ...notifications]

  console.log('allNotifications', allNotifications)

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="notification-dropdown">
      <div className="dropdown-list">
        {allNotifications.length === 0 ? (
          <div className="dropdown-empty">No notifications yet</div>
        ) : (
          allNotifications
            .slice(0, 5)
            .map((n) => <NotificationItem key={n._id} allNotification={n} />)
        )}
      </div>
      <div className="dropdown-footer">
        <Link to={'/notifications'}>See more</Link>
      </div>
    </div>
  )
}
