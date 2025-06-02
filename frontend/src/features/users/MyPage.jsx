// 使わん

import React from 'react'
import { useGetLikedSongsQuery } from '../songs/songApiSlice'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import SongList from '../../components/SongList'
import { useGetUserProfileQuery } from './usersApiSlice'

const MyPage = () => {

  const currentUser = useSelector(selectCurrentUser)
  console.log('Current user from Redux:', currentUser)

  // data: user ではダメ。何故ならdataはuserとsongsの二つ持っているから直では無理
  const { 
    data, 
    isLoading, 
    isError,
    error 
  } = useGetUserProfileQuery(currentUser._id)

  const { user, songs } = data

  const {
    data: likedSongs,
    isLoading: isLoadingLiked,
    isError: isErrorLiked,
    error: errorLiked
  } = useGetLikedSongsQuery()

  if (!user) return <p>Loading user...</p>
  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error: {error?.data?.message || 'Failed to Load'}</p>

  console.log('user:', user)

  return (
    <section>
      <h2>My Page 🎵</h2>
        <>@{user.username}</>
        {user.icon && (
          <img src={`http://localhost:3500/${user.icon}`} alt="icon" width="120" />
        )}
        {!user.icon && (
          <p>No user icon yet</p>
        )}
      <>Bio: {user.bio}</>
      <p>
        <Link to="/mypage/edit">
          <button>Edit Profile</button>
        </Link>
      </p>
      {currentUser?._id && <Link to={`/users/${currentUser._id}`}>自分の公開プロフィールを見る</Link>}
      <li>
        <Link to={'/dash'}>Dashboard</Link>
      </li>
      <ul>
        <h3>My Songs</h3>
        {isLoading ? (
            <p>Loading my songs...</p>
        ) : isError ? (
            <p>Error: {error?.data?.message}</p>
        ) : songs?.length === 0 ? (
            <p>No liked songs yet</p>
        ) : (
            <SongList songs={songs} />
        )}
      </ul>
      <ul>
        <h3>Liked Songs</h3>
        {isLoadingLiked ? (
            <p>Loading liked songs...</p>
        ) : isErrorLiked ? (
            <p>Error: {errorLiked?.data?.message}</p>
        ) : likedSongs?.length === 0 ? (
            <p>No liked songs yet</p>
        ) : (
            <SongList songs={likedSongs} />
        )}
      </ul>
    </section>
  )
}

export default MyPage
