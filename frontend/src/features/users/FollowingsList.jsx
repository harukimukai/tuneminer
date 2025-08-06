import React from 'react'
import { useGetFollowingUsersQuery } from './usersApiSlice'
import { useParams } from 'react-router-dom'

const FollowingsList = () => {
  const { id } = useParams()
  const {data: followings = []} = useGetFollowingUsersQuery(id)

  if (!followings?.length || !id) return <p>You are not following anybody yet.</p>
  
  return (
    <div>
      <h1>Following List</h1>
      <div>
        {followings.map((f) => (
          <div key={f._id}>
            <h2>{f.icon}</h2>
            <h2>{f.username}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FollowingsList