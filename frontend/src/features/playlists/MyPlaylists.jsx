import React from 'react'
import { useGetMyPlaylistsQuery } from './playlistApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'

const MyPlaylists = () => {
  const currentUser = useSelector(selectCurrentUser)
  const { data: playlists = [], isLoading, isError, error } = useGetMyPlaylistsQuery(currentUser?._id)

  if (isLoading) return <p>読み込み中...</p>
  if (isError) return <p>エラーが発生しました: {error?.message}</p>

  return (
    <div>
      <h2>My Playlists</h2>
      {playlists.length === 0 ? (
        <p>No Playlists yet</p>
      ) : (
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist._id}>
              <img
                src={`http://localhost:3500/${playlist.coverImage}`}
                alt={playlist.title}
                width="100"
              />
              <h3>{playlist.title}</h3>
              <p>{playlist.description}</p>
              <p>Public: {playlist.isPublic ? '✅' : '❌'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


export default MyPlaylists
