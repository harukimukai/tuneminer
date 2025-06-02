// src/features/songs/SongDetail.jsx

import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  useDeleteSongMutation, 
  useGetSongByIdQuery, 
  useToggleLikeMutation, 
  useToggleAdminRecomMutation 
} from '../features/songs/songApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useEffect, useState } from 'react'
import CommentSection from '../features/comments/CommentSection'
import CustomAudioPlayer from './CustomAudioPlayer'
import Waveform from './Waveform'
import '../css/modal.css'

const SongDetail = ({ modalMode = false, onClose }) => {
  const { id } = useParams()
  const { data: song, isLoading, isError, error } = useGetSongByIdQuery(id)
  const [toggleLike] = useToggleLikeMutation()
  const [deleteSong] = useDeleteSongMutation()
  const [toggleAdminRecommendation] = useToggleAdminRecomMutation()
  const currentUser = useSelector(selectCurrentUser)
  const [viewMode, setViewMode] = useState('lyrics')
  const navigate = useNavigate()

  console.log('songId', id)

  // SongDetail.jsx や他のモーダルファイルの先頭に追加
  useEffect(() => {
    console.log('[Modal] SongDetail mounted')
    return () => console.log('[Modal] SongDetail unmounted')
  }, [])

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
  if (!currentUser) return <p>Current user not found</p>

  const isOwner = song.user._id === currentUser?._id



  const handleDelete = async (id) => {
    console.log('delete id: ', id)
    const confirm = window.confirm('Are you sure deleting this song?')
    if (!confirm) return
    console.log('delete id: ', id)

    try {
        await deleteSong(id).unwrap()
        alert('Deleted the song')
        navigate(-1)
    } catch (error) {
        console.error('Failed to delete: ', error)
        alert('Could not delete')
    }
  }

  return (
    <div className={modalMode ? 'p-4' : 'p-8'}>
      <div className="modal-overlay">
        <div className="modal-container">
          <button className="modal-close" onClick={onClose}>✕</button>
          <div className="modal-content">
            <div className="modal-left">
              <p className='createdAt'>
                {song.releasedDate && <p>Released at : {new Date(song.releasedDate).toLocaleDateString()}</p>}
                {song.createdAt && <p>Released at : {new Date(song.createdAt).toLocaleDateString()}</p>}
              </p>
              {song.imageFile && (
                <div className='song-modal-image-box'>
                  <img 
                    src={`http://localhost:3500/${song.imageFile}`} 
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
                        <img src={`http://localhost:3500/${song.user.icon}`} alt="icon" />  
                      ) : (
                        <img src='http://localhost:3000/default_user_icon.jpg' alt="icon" />
                      )}
                      <span>@{song.user.username}</span>
                    </Link>
                )}
                <p className='song-artist'>Genre: {song.genre}</p>
              </div>
              <div className="likes">
                <p>{song.likes.length} Likes</p>
                <button 
                  className="like-button"
                  onClick={() => toggleLike(song._id)}
                >
                  {song.likes.includes(currentUser._id) ? 'Unlike' : 'Like'}
                </button>
                {currentUser?.isAdmin && (
                  <button 
                    className="like-button"
                    onClick={() => toggleAdminRecommendation(song._id)}>
                    {song.isRecommended ? 'AdUnrec' : 'AdRec' }
                  </button>
                )}
              </div>
              <div className='buttons'>
                {isOwner || currentUser?.isAdmin ? (
                  <>
                    <Link to={`/songs/${song._id}/edit`}>
                      <button className="button">
                        Edit
                      </button>
                    </Link>
                    <button className="button" onClick={() => handleDelete(song._id)}>Delete</button>
                  </>
                ) : null}
              </div>
            </div>

            <div className="modal-right">
              <div className="tab-buttons">
                <button className={`tab-button ${viewMode === 'lyrics' ? 'active' : ''}`} onClick={() => setViewMode('lyrics')}>Lyrics</button>
                <button className={`tab-button ${viewMode === 'comments' ? 'active' : ''}`} onClick={() => setViewMode('comments')}>Comments</button>
              </div>
              <div className="lyrics-box">
                <div className="w-full max-h-[350px] min-h-[350px] overflow-y-auto bg-gray-500 rounded p-8 text-sm">
                  {viewMode === 'lyrics' ? (
                    <pre className="whitespace-pre-wrap">{song.lyrics || 'No lyrics provided'}</pre>
                  ) : (
                    <CommentSection songId={song._id} />
                  )}
                </div>
              </div>
              <p className='plays'>{song.plays?.length ? <p>{song.plays.length} Plays</p> : <p>0 Plays</p>}</p>
              <Waveform
                audioUrl={`http://localhost:3500/${song.audioFile}`}
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