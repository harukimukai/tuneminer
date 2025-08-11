import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectNowPlaying, togglePlay } from '../features/player/nowPlayingSlice'
import Modal from './Modal'
import SongDetail from './SongDetail'
import '../css/nowPlayingBar.css'
import VolumeControl from './VolumeControl'
import { API_BASE_URL, CLIENT_BASE_URL } from '../config/constants'

const NowPlayingBar = () => {
  const [selectedSongId, setSelectedSongId] = useState(null)
  const dispatch = useDispatch()
  const { currentSong, isPlaying, volume } = useSelector(selectNowPlaying)
  const navigate = useNavigate()
  const location = useLocation()
  const infoRef = useRef(null)
  const textRef = useRef(null)

  const title = currentSong?.title || null

  useEffect(() => {
  const info = infoRef.current
  const text = textRef.current
  if (!info || !text) return

  const applyScrollAnimation = () => {
    text.classList.remove("animate")
    void text.offsetWidth

    if (text.scrollWidth > info.clientWidth) {
      text.classList.add("animate")
    }
  }

  // 初回実行 + title変更時
  applyScrollAnimation()

  // 画面サイズが変わったときにも再チェック
  window.addEventListener("resize", applyScrollAnimation)

  // クリーンアップ
  return () => {
    window.removeEventListener("resize", applyScrollAnimation)
  }
  }, [title]) // ← 曲タイトルが変わったときに再実行される

  const handleOpenModal = (id) => {
    navigate(`/songs/modal/${id}`, { state: { background: location } }) // URLだけ変更
  }

  

  let content
  if (!currentSong) {
    content = (
      <div className="now-playing-bar">
        <img 
          src={`${CLIENT_BASE_URL}/logo4.png`}
          alt="artwork" 
          className="now-playing-image"
        />
        <p className='text-center'>Play Song!</p>
        <div className="volume-control">
          <VolumeControl volume={volume} />
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
            src={`${API_BASE_URL}/${currentSong.imageUrl}`} 
            alt="artwork" 
            className="now-playing-image"
          />
        </button>
        <div className='now-playing-info' ref={infoRef}>
          <div className='scroll' ref={textRef}>
          <button
            onClick={() => handleOpenModal(currentSong._id)}
          >
            <p className="now-playing-title">{currentSong.title}</p>
          </button>
          <Link
            to={`/users/${currentSong.artistId}`}
          >
            <p className="now-playing-artist">{currentSong.artistName}</p>
          </Link>
          </div>
        </div>
        <button onClick={() => dispatch(togglePlay())} className="now-playing-button">
          {isPlaying ? '⏸' : '▶'}
        </button>
        <div className="volume-control">
          <VolumeControl volume={volume} />
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
