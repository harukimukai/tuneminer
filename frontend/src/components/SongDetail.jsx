// src/features/songs/SongDetail.jsx

import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  useDeleteSongMutation, 
  useGetSongByIdQuery, 
  useToggleLikeMutation, 
  useToggleAdminRecomMutation 
} from '../features/songs/songApiSlice'
import { useAddSongPlaylistMutation, useGetMyPlaylistsQuery } from '../features/playlists/playlistApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useEffect, useState } from 'react'
import CommentSection from '../features/comments/CommentSection'
import CustomAudioPlayer from './CustomAudioPlayer'
import Waveform from './Waveform'
import '../css/modal.css'
import { API_BASE_URL, CLIENT_BASE_URL } from '../config/constants'

const SongDetail = ({ modalMode = false, onClose }) => {
  const { id } = useParams()
  const currentUser = useSelector(selectCurrentUser)
  const currentUserId = currentUser?._id
  const { data: song, isLoading, isError, error } = useGetSongByIdQuery(id)
  const { data: myPlaylists = [] } = useGetMyPlaylistsQuery(currentUserId)
  const [toggleLike] = useToggleLikeMutation()
  const [addSongPlaylist] = useAddSongPlaylistMutation()
  const [deleteSong] = useDeleteSongMutation()
  const [toggleAdminRecommendation] = useToggleAdminRecomMutation()
  const [viewMode, setViewMode] = useState('lyrics')
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const [isOpenPlaylists, setIsOpenPlaylists] = useState(false)
  const navigate = useNavigate()
  const toggleMenu = () => {
    if (isOpenPlaylists) setIsOpenPlaylists(false)
    setIsOpenMenu(prev => !prev)
  }
  const togglePlaylists = () => {
    if (isOpenMenu) setIsOpenMenu(false)
    setIsOpenPlaylists(prev => !prev)
  }

  useEffect(() => {
    if (modalMode) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  
    // クリーンアップ（モーダルが閉じられたら確実に解除）
    return () => document.body.classList.remove('no-scroll');
  }, [modalMode]);


  if (isLoading) return <p>Loading song...</p>
  if (isError) return <p>{error?.data?.message || 'Failed to load song'}</p>
  if (!song) return <p>Song not found</p>
  // if (!currentUser) return <p>Current user not found</p>

  const isOwner = song.user._id === currentUser?._id

  const handleLike = async(songId) => {
    if (!currentUser) {
      const confirm = window.confirm('You need to login to like this song!')
      if (confirm) {
        return navigate('/login')
      } else return
    }

    toggleLike(songId).unwrap()
  }

  const handleDelete = async(id) => {
    const confirm = window.confirm('Are you sure deleting this song?')
    if (!confirm) return

    try {
        await deleteSong(id).unwrap()
        alert('Deleted the song')
        navigate(-1)
    } catch (error) {
        console.error('Failed to delete: ', error)
        alert('Could not delete')
    }
  }

  const handleAddSong = async(myPlaylistId, songId) => {
    try {
      await addSongPlaylist({playlistId: myPlaylistId, songId}).unwrap()
      alert('This song is added!')
    } catch (error) {
      console.error(error)
      alert('This song could not be added!')
    }
  }

  return (
    <div className={modalMode ? 'p-4' : 'p-8'}>
      <div className="modal-overlay">
        <div>
          <Link to={'/songs/mining'}>
           <p className='modal-background-character'></p>
          </Link>
        </div>
        <div className="modal-container">
          <button className="modal-close" onClick={onClose}>✕</button>
          <div className="modal-content">
            <div className="modal-left">
              {song.original ? 
                (<p>Original</p>) : (<p>Cover</p>)
              }
              <div className='createdAt'>
                {song.releasedDate && <p>Released at: {new Date(song.releasedDate).toLocaleDateString()}</p>}
                {song.createdAt && <p>Released at: {new Date(song.createdAt).toLocaleDateString()}</p>}
              </div>
              {song.imageFile && (
                <div className='song-modal-image-box'>
                  <img 
                    src={`${API_BASE_URL}/${song.imageFile}`} 
                    alt={song.title}
                    className="song-modal-image"
                  />
                </div>
              )}
              <h1 className='song-title'>{song.title}</h1>
              <div className="links">
                {song.user?._id && (
                    <Link to={`/users/${song.user._id}`} className='song-artist'>
                      {song.user.icon ? (
                        <img src={`${API_BASE_URL}/${song.user.icon}`} alt="icon" />  
                      ) : (
                        <img src={`${CLIENT_BASE_URL}/default_user_icon.jpg`} alt="icon" />
                      )}
                      <span>@{song.user.username}</span>
                    </Link>
                )}
                <p className='song-artist'>Genre: {song.genre}</p>
              </div>
              <div className='buttons'>
                <div className="likes">
                  <p>{song.likes.length} Likes</p>
                  <button 
                    className="like-button"
                    onClick={() => handleLike(song._id)}
                  >
                    {song.likes.includes(currentUser?._id) ? 'Unlike' : 'Like'}
                  </button>
                  {currentUser?.isAdmin && (
                    <button 
                      className="like-button"
                      onClick={() => toggleAdminRecommendation(song._id)}>
                      {song.isRecommended ? 'AdUnrec' : 'AdRec' }
                    </button>
                  )}
                </div>
                
                  <>
                    <div className="dropdown-container">
                      <button 
                        className="dropdown-toggle" 
                        onClick={toggleMenu}
                      >
                        ⋮
                      </button>
                      {isOpenMenu && (
                        isOwner || currentUser?.isAdmin ? (
                          <div className="dropdown-menu">
                            <Link to={`/songs/${song._id}/edit`}>
                              <button className="button">
                                Edit
                              </button>
                            </Link>
                            <button className="button" onClick={() => handleDelete(song._id)}>Delete</button>
                          </div>
                        ) : (
                          <div className="dropdown-menu">
                            <Link to={`/report/song/${song._id}`}>
                              <button className="button">
                                Report
                              </button>
                            </Link>
                          </div>
                        )
                      )}
                    </div>
                    <div className="dropdown-container">
                      <button className="dropdown-toggle" onClick={togglePlaylists}>+</button>
                        {isOpenPlaylists &&
                          <div className="dropdown-menu">
                            {myPlaylists.map((myPlaylist) => (
                              <div key={myPlaylist._id}>
                                <button
                                  onClick={() => handleAddSong(myPlaylist._id, song._id)}
                                >
                                  <h3>{myPlaylist.title}</h3>
                                  <p>{myPlaylist.songs.includes(song._id) ? '✅' : ''}</p>
                                </button>
                              </div>
                            ))}
                          </div>
                        }
                    </div>
                  </>
              </div>
            </div>

            <div className="modal-right">
              <div className="tab-buttons">
                <button className={`tab-button ${viewMode === 'lyrics' ? 'active' : ''}`} onClick={() => setViewMode('lyrics')}>Lyrics</button>
                <button className={`tab-button ${viewMode === 'comments' ? 'active' : ''}`} onClick={() => setViewMode('comments')}>Comments</button>
              </div>
              <div className="lyrics-box">
                <div className="w-full max-h-[350px] min-h-[350px] overflow-y-auto #4a4a4a rounded p-8 text-sm">
                  {viewMode === 'lyrics' ? (
                    <pre className="whitespace-pre-wrap">{song.lyrics || 'No lyrics provided'}</pre>
                  ) : (
                    <CommentSection songId={song._id} />
                  )}
                </div>
              </div>
              <div className='plays'>{song.plays?.length ? <p>{song.plays.length} Plays</p> : <p>0 Plays</p>}</div>
              <Waveform
                audioUrl={`${API_BASE_URL}/${song.audioFile}`}
                songId={song._id}
              />
              <CustomAudioPlayer
                song={song}
                id={id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SongDetail