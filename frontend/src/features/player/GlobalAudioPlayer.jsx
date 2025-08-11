import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectNowPlaying,
  setCurrentTime,
  setDuration,
  setSeekTime,
} from './nowPlayingSlice'
import { API_BASE_URL } from '../../config/constants'

const GlobalAudioPlayer = () => {
  const { currentSong, isPlaying, seekTime, volume, pausedSnapshot } = useSelector(selectNowPlaying)
  const isMiningActive = useSelector(state => state.ui.isMiningActive)
  const isPrivateMode = useSelector(state => state.ui.isPrivateMode)
  const dispatch = useDispatch()
  const audioRef = useRef(null)

  // 🔄 曲が切り替わったら audio を手動で load（先読み）
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.load()

      if (pausedSnapshot?.song?._id === currentSong._id && pausedSnapshot?.currentTime != null) {
        audioRef.current.onloadedmetadata = () => {
          audioRef.current.currentTime = pausedSnapshot.currentTime
        }
      }
    }
  }, [currentSong, pausedSnapshot])

  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.warn('[GlobalAudio] play失敗:', err)
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, currentSong])

  useEffect(() => {
    if (audioRef.current && volume !== undefined) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (seekTime !== null && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = seekTime

      if (isPlaying) {
        setTimeout(() => {
          audioRef.current.play().catch(err => console.warn('Autoplay error after seek:', err))
        }, 200) // 🔸 少し遅らせてバッファ時間を確保
      }

      dispatch(setSeekTime(null))
    }
  }, [seekTime, isPlaying, dispatch])

  useEffect(() => {
    if (!audioRef.current) return

    if (isMiningActive) {
      audioRef.current.pause()
      return
    }

    if (isPrivateMode) {
      audioRef.current.pause()
      return
    }

    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.warn('[GlobalAudio] failed to play:', err)
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, isMiningActive, isPrivateMode])

  const handleTimeUpdate = () => {
    dispatch(setCurrentTime(audioRef.current.currentTime))
  }

  const handleLoadedMetadata = () => {
    dispatch(setDuration(audioRef.current.duration))
  }

  if (!currentSong) {
    return null
  }

  return (
    <audio
      ref={audioRef}
      preload="auto" /* 先読みを促す */
      src={`${API_BASE_URL}/${currentSong.audioUrl}`}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
    />
  )
}

export default GlobalAudioPlayer
