import React from 'react'
import { useGetMyPlaylistsQuery } from './playlistApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../config/constants'
import '../../css/playlist.css'

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
        <ul style={{ display: 'flex', gap: '8px'}}>
          {playlists.map((playlist) => (
            <li key={playlist._id}>
              <button
                onClick={() => handleOpenPlaylist(playlist._id)}
              >
                <div className="img_container">
                  <img
                    src={`${API_BASE_URL}/${playlist.coverImage}`}
                    alt={playlist.title}
                    style={{height: '250px', aspectRatio: '1/1', objectFit: 'cover' , borderRadius: '8px', filter: 'blur(0.5px) contrast(0.95) brightness(1.05)' }}
                  />
                  <h3 className='title'>{playlist.title}</h3>
                  <p className='isPublic'>{playlist.isPublic ? 'Public' : 'Private'}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


export default MyPlaylists
