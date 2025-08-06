import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { Link } from 'react-router-dom'
import '../css/modal.css'
import MiningProgressBar from './MiningProgressBar'
import { useAddMiningLikeMutation } from '../features/mining/miningApiSlice'
import MiningLikeButton from '../features/mining/MiningLikeButton'
import { API_BASE_URL, CLIENT_BASE_URL } from '../config/constants'

const SongDetailLite = 
  ({ 
    song, 
    index, 
    miningMode, 
    onLikeToggle, 
    onNext, 
    onPrev, 
    audioRef
  }) => {
  
  const currentUser = useSelector(selectCurrentUser)
  const [addMiningLike] = useAddMiningLikeMutation()
  const [isPlaying, setIsPlaying] = useState(true)
  const liked = song.likes.includes(currentUser?._id)

  const handlePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    setIsPlaying(true)
  }, [song])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => setIsPlaying(false)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('ended', handleEnded)
    }

  }, [audioRef])

  const handleMiningLike = async(songId) => {
    try {
      await addMiningLike(songId).unwrap()
      onLikeToggle(songId, liked)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="modal-overlay">
      {index !== 0 && <button onClick={onPrev}>Previous</button>}
      <div className="modal-lite-container">
        <div>
          <p className='createdAt'>
            {song.releasedDate && 
              <p>
                Released at : {new Date(song.releasedDate).toLocaleDateString()}
              </p>
            }
            {song.createdAt && 
              <p>
                Released at : {new Date(song.createdAt).toLocaleDateString()}
              </p>
            }
          </p>
          {song.imageFile && (
            <div className='song-modal-lite-image-box'>
              <img 
                src={`${API_BASE_URL}/${song.imageFile}`} 
                alt={song.title}
                className='song-modal-lite-image'
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
            <p className='song-artist'>{song.genre}</p>
          </div>
          <audio ref={audioRef} src={`${API_BASE_URL}/${song.audioFile}`} hidden />
          <button onClick={handlePlayPause} style={{ cursor: 'pointer', marginTop: '10px' }}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          {miningMode && song.highlight && (
            <MiningProgressBar 
              highlight={song.highlight} 
              audioRef={audioRef}
            />
          )}
          {currentUser &&  <MiningLikeButton songId = {song._id}/>}
        </div>
      </div>
      {/* {!song.likes.includes(currentUser._id) &&
        <>
          <button onClick={handleLike}>
            Like
          </button>
        </>
      }
      {song.likes.includes(currentUser._id) &&
        <>
          <button onClick={handleLike}>
            Unlike
          </button>
        </>
      } */}
      <button onClick={onNext}>Next</button>
    </div>
  )
}

export default SongDetailLite
