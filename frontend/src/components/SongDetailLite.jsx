import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useToggleLikeMutation } from '../features/songs/songApiSlice'
import { Link } from 'react-router-dom'
import '../css/modal.css'

const SongDetailLite = ({ song, index, miningMode, onLikeToggle, onNext, onPrev, audioRef }) => {
  const currentUser = useSelector(selectCurrentUser)
  const [toggleLike] = useToggleLikeMutation()
  const liked = song.likes.includes(currentUser._id)

  const handleLike = async () => {
    try {
      await toggleLike(song._id).unwrap()
      onLikeToggle(song._id, liked)
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
                src={`http://localhost:3500/${song.imageFile}`} 
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
                    <img src={`http://localhost:3500/${song.user.icon}`} alt="icon" />
                  ) : (
                    <img src='http://localhost:3000/default_user_icon.jpg' alt="icon" />
                  )}
                  <span>@{song.user.username}</span>
                </Link>
            )}
            <p className='song-artist'>Genre: {song.genre}</p>
          </div>
          <audio ref={audioRef} src={`http://localhost:3500/${song.audioFile}`} controls/>
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
