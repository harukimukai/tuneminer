import React from 'react'
import { useGetFollowersQuery } from './usersApiSlice'
import { Link, useParams } from 'react-router-dom'
import { API_BASE_URL, CLIENT_BASE_URL } from '../../config/constants'

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

export default FollowersList