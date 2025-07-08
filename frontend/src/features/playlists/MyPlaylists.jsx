import React from 'react'
import { useGetMyPlaylistsQuery, useGetPlaylistByIdQuery } from './playlistApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import { Link, useNavigate } from 'react-router-dom'

const MyPlaylists = () => {
  const currentUser = useSelector(selectCurrentUser)
  const { data: playlists = [], isLoading, isError, error } = useGetMyPlaylistsQuery(currentUser?._id)
  const navigate = useNavigate()

  if (isLoading) return <p>読み込み中...</p>
  if (isError) return <p>エラーが発生しました: {error?.message}</p>

  const handleOpenPlaylist = (playlistId) => {
    navigate(`/playlists/${playlistId}`)
  }



  return (
    <div>
      <h2>My Playlists</h2>
      {playlists.length === 0 ? (
        <p>No Playlists yet</p>
      ) : (
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist._id}>
              <button
                onClick={() => handleOpenPlaylist(playlist._id)}
              >
                <img
                  src={`http://localhost:3500/${playlist.coverImage}`}
                  alt={playlist.title}
                  width="100"
                />
                <h3>{playlist.title}</h3>
                <p>{playlist.description}</p>
                <p>Public: {playlist.isPublic ? '✅' : '❌'}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


export default MyPlaylists
