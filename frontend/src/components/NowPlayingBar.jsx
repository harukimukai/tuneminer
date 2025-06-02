import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectNowPlaying, togglePlay, setVolume } from '../features/player/nowPlayingSlice'
import Modal from './Modal'
import SongDetail from './SongDetail'
import '../css/nowPlayingBar.css'

const NowPlayingBar = () => {
  const [selectedSongId, setSelectedSongId] = useState(null)
  const dispatch = useDispatch()
  const { currentSong, isPlaying, volume } = useSelector(selectNowPlaying)
  const navigate = useNavigate()
  const location = useLocation()

  const handleOpenModal = (id) => {
    console.log('handleOpenModal')
    navigate(`/songs/modal/${id}`, { state: { background: location } }) // URLだけ変更
  }

  let content
  if (!currentSong) {
    content = (
      <div className="now-playing-bar">
        <img 
          src='http://localhost:3000/logo4.png' 
          alt="artwork" 
          className="now-playing-image"
        />
        <p className='text-center'>Play Song!</p>
        <div className="volume-control" style={{ margin: '8px' }}>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => dispatch(setVolume(parseFloat(e.target.value)))}
          />
        </div>
      </div>
    )
  } else {
    content = (
      <>
      <div className="now-playing-bar">
        <button
          onClick={() => handleOpenModal(currentSong._id)}
        >
          <img 
            src={`http://localhost:3500/${currentSong.imageUrl}`} 
            alt="artwork" 
            className="now-playing-image"
          />
        </button>
        <div className="now-playing-info">
          <button
            onClick={() => handleOpenModal(currentSong._id)}
          >
            <p className="now-playing-title">{currentSong.title}</p>
          </button>
          <Link
            to={`/users/${currentSong.artistId}`}
            className='song-info-user'
          >
            <p className="now-playing-artist">{currentSong.artistName}</p>
          </Link>
        </div>
        <button onClick={() => dispatch(togglePlay())} className="now-playing-button">
          {isPlaying ? '⏸' : '▶'}
        </button>
        <div className="volume-control" style={{ margin: '8px' }}>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => dispatch(setVolume(parseFloat(e.target.value)))}
          />
        </div>
      </div>

      {selectedSongId && (
        <Modal onClose={() => setSelectedSongId(null)}>
          <SongDetail id={selectedSongId} modalMode onClose={() => setSelectedSongId(null)} />
        </Modal>
      )}
    </>
    )
  }

  return content
}

export default NowPlayingBar
