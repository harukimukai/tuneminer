import { useGetNotificationsQuery } from './notificationApiSlice'

const NotificationList = () => {
  const { data: notifications = [], isLoading, error } = useGetNotificationsQuery()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading notifications</p>

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications?.length ? 
          notifications.map((n) => (
            <li key={n._id}>
              <strong>{n.sender?.username}</strong>: {n.content}
              <br />
              <a href={n.link}>View</a>
            </li>
          ))
          : <p>No notifications</p>
        }
      </ul>
    </div>
  )
}

export default NotificationList
