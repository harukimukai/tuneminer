import React from 'react'
import { useGetFollowingUsersQuery } from './usersApiSlice'
import { Link, useParams } from 'react-router-dom'
import { API_BASE_URL, CLIENT_BASE_URL } from '../../config/constants'

const FollowingsList = () => {
  const { id } = useParams()
  const {data: followings = []} = useGetFollowingUsersQuery(id)

  if (!followings?.length || !id) return <p>You are not following anybody yet.</p>
  
  return (
    <div>
      <h1>Following List</h1>
      <div style={{ display: 'flex' }}>
        {followings.map((f) => (
          <div key={f._id}>
            <Link to={`/users/${f._id}`}>
              {f.icon ? (
                <img 
                  src={`${API_BASE_URL}/${f.icon}`} 
                  alt="icon" 
                  className='user-page_user-icon'
                />
              ) : (
                <img 
                  src={`${CLIENT_BASE_URL}/default_user_icon.jpg`} 
                  alt="icon" 
                  className='user-page_user-icon'
                />
              )}
              <h2>{f.username}</h2>
              <p>{f.bio}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FollowingsList