import React, { useState } from 'react'
import { FaBell } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import '../../css/notification/notificationBell.css'
import { useGetNotificationsQuery } from './notificationApiSlice'

export const NotificationBell = ({ onClick }) => {
  const { data: notifications = [], isLoading, error } = useGetNotificationsQuery()
  const notificationsFromSocket = useSelector(state => state.notifications.list) // 👈 Socket追加分
  const allNotifications = [...notificationsFromSocket, ...notifications]
  const unreadCount = allNotifications.filter(n => !n.isRead).length

  return (
    <div className="notification-bell-container" onClick={onClick}>
      <FaBell className="notification-bell-icon" />
      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  )
}
