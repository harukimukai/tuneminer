import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useFollowUserMutation, useGetFollowersQuery, useGetFollowingUsersQuery, useGetUserProfileQuery } from './usersApiSlice'
import { useCreateConversationMutation } from '../messages/conversationApiSlice'
import SongList from '../../components/SongList'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import '../../css/userPage.css'

const UserPage = () => {
  const { id } = useParams()
  const { data, isLoading, isError, error } = useGetUserProfileQuery(id)
  const [ createConversation ] = useCreateConversationMutation()
  const [followUser] = useFollowUserMutation()
  const currentUser = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  console.log(currentUser)

  if (!data) return <p>Loading user...</p>
  if (isLoading) return <p>Loading...</p>
  if (isError) return <p style={{ color: 'red' }}>{error?.data?.message}</p>
  if (!currentUser) return <p>No currentUser</p>


  const { user, songs } = data
  const sameUser = user._id === currentUser._id
  const alreadyFollow = user.followers.includes(currentUser._id)

  const handleFollow = async () => {
    try {
      await followUser(user._id).unwrap()
      console.log('Followed/Unfollowed')
    } catch (err) {
      console.error('failed to follow/unfollow:', err)
    }
  }

  const handleStartConversation = async (recipientId) => {
    console.log('handleStartConversation', recipientId)
    try {
      const newConv = await createConversation(recipientId).unwrap()
      console.log('[UserProfile] New conversation created:', newConv)
      navigate(`/messages/${newConv._id}`) // メッセージ画面へ遷移
    } catch (err) {
      console.error('Failed to start conversation:', err)
    }
  }

  return (
    <section className='user-page_user-info-container'>
      <div className='user-page_user-info'>
        {user.icon ? (
            <img 
              src={`http://localhost:3500/${user.icon}`} 
              alt="icon" 
              className='user-page_user-icon'
            />
        ) : (
            <img 
              src='http://localhost:3000/default_user_icon.jpg' 
              alt="icon" 
              className='user-page_user-icon'
            />
        )}
        <div>
          <p className='user-page_username'>@{user.username}</p>
          {user.createdAt && 
            <p>Join: {new Date(user.createdAt).toLocaleDateString()}</p>
          }
          {user.startedDate && 
            <p>Join: {new Date(user.startedDate).toLocaleDateString()}</p>
          }
        </div>
      </div>
      <div className="user-page-buttons">
        {!sameUser && 
          (alreadyFollow ? (
              <button 
                onClick={handleFollow} 
                className='user-page-button'
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className='user-page-button'
              >
                Follow
              </button>
            )
          )}
          {!sameUser && (
            /* 💬 新しい会話を始めるボタン */
            <button
              className='user-page-button'
              onClick={() => handleStartConversation(user._id)}
            >
              Message
            </button>
          )}
        {sameUser && (
          <Link to={`/mypage/${id}`}>
              <button className='user-page-button'>Edit</button>
          </ Link>
        )}
        {sameUser && (
          <Link to={`/play-history/${user._id}`}>
              <button className='user-page-button'>History</button>
          </ Link>
        )}
      </div>
      <>Followers: {user.followers.length} Following: {user.following.length}</>
      <br />
      <>Bio: {user.bio}</>
      <h3>Uploaded Songs</h3>
      {songs.length === 0 ? (
        <p>No songs yet</p>
      ) : (
        <SongList songs={songs} />
      )}
    </section>
  )
}

export default UserPage
