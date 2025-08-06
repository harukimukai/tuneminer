import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useFollowUserMutation, useGetUserProfileQuery } from './usersApiSlice'
import { useCreateConversationMutation } from '../messages/conversationApiSlice'
import SongList from '../../components/SongList'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import '../../css/userPage.css'
import { useGetLikedSongsQuery } from '../songs/songApiSlice'
import SocialLinks from '../../components/SocialLinks'
import MyPlaylists from '../playlists/MyPlaylists'
import { API_BASE_URL, CLIENT_BASE_URL } from '../../config/constants'

const UserPage = () => {
  const { id } = useParams()
  const { data, isLoading, isError, error } = useGetUserProfileQuery(id)
  const {data: likedSongs} = useGetLikedSongsQuery(id)
  const [ createConversation ] = useCreateConversationMutation()
  const [followUser] = useFollowUserMutation()
  const currentUser = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('uploadedSongs')
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  console.log(currentUser)

  if (!data) return <p>Loading user...</p>
  if (isLoading) return <p>Loading...</p>
  if (isError) return <p style={{ color: 'red' }}>{error?.data?.message}</p>
  // if (!currentUser) return <p>No currentUser</p>


  const { user, songs } = data
  const sameUser = user._id === currentUser?._id
  const alreadyFollow = user.followers.includes(currentUser?._id)

  const toggleMenu = () => {
    setIsOpenMenu(prev => !prev)
  }

  const handleFollow = async () => {
    if (!currentUser) {
      const confirm = window.confirm('You need to login to follow this user')
      if (confirm) {
        navigate('/login')
      } else return
    }

    try {
      await followUser(user._id).unwrap()
      console.log('Followed/Unfollowed')
    } catch (err) {
      console.error('failed to follow/unfollow:', err)
    }
  }

  const handleStartConversation = async (recipientId) => {
    if (!currentUser) return

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
              src={`${API_BASE_URL}/${user.icon}`} 
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
        {!sameUser && (
          <div className="dropdown-container">
            <button 
              className="dropdown-toggle" 
              onClick={toggleMenu}
            >
              ⋮
            </button>
            {isOpenMenu && (
              <div className="dropdown-menu">
                <Link to={`/report/user/${user._id}`} onClick={() => console.log('Clicked report link', user._id)}>
                  <button className="button">
                    Report
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      <div className='follow__length'>
        <Link to={`/followers-list/${user._id}`}>
          Followers: {user.followers.length}
        </Link> 
        <Link to={`/followings-list/${user._id}`}>
          Following: {user.following.length}
        </Link>
      </div>
      <br />
      <>Bio: {user.bio}</> <br />
      <SocialLinks socials={user.socials} />
      <div className="tab-buttons">
        <button className={`tab-button ${viewMode === 'uploadedSongs' ? '' : 'active'}`} onClick={() => setViewMode('uploadedSongs')}>Uploaded Songs</button>
        <button className={`tab-button ${viewMode === 'likedSongs' ? '' : 'active'}`} onClick={() => setViewMode('likedSongs')}>Liked Songs</button>
        <button className={`tab-button ${viewMode === 'myPlaylists' ? '' : 'active'}`} onClick={() => setViewMode('myPlaylists')}>My Playlists</button>
      </div>

      {viewMode === 'uploadedSongs' ? (
        <div>
          {songs.length === 0 ? (
            <p>No songs yet</p>
          ) : (
            <SongList songs={songs} />
          )}
        </div>
      ) : viewMode === 'likedSongs' ? (
        <div>
          {sameUser && (
            likedSongs.length === 0 ? (
              <div>
                <p>No songs yet</p>
              </div>
            ) : (
              <div>
                <SongList songs={likedSongs} />
              </div>
            )
          )}
        </div>
      ) : (
        <div>
          {sameUser && (
            likedSongs.length === 0 ? (
              <div>
                <p>No Playlists yet</p>
              </div>
            ) : (
              <div>
                <MyPlaylists />
              </div>
            )
          )}
        </div>
      )}
    </section>
  )
}

export default UserPage
