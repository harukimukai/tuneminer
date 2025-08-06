import React from 'react'
import { useGetFollowersQuery } from './usersApiSlice'
import { useParams } from 'react-router-dom'

const FollowersList = () => {
  const { id } = useParams()
  const {data: followers = []} = useGetFollowersQuery(id)

  if (!followers?.length || !id) return <p>No Followers</p>
  
  return (
    <div>
      <h1>FollowersList</h1>
      <div>
        {followers.map((f) => (
          <div key={f._id}>
            <h2>{f.icon}</h2>
            <h2>{f.username}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FollowersList