import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  selectPrivateAudio, 
  setPrivateCurrentTime, 
  setPrivateDuration, 
  setPrivateSeekTime 
} from './privateAudioSlice'
import { API_BASE_URL } from '../../../config/constants'

const PrivateAudioPlayer = () => {
  const { currentPrivateSong, privateIsPlaying, privateSeekTime } = useSelector(selectPrivateAudio)
  const dispatch = useDispatch()
  const audioRef = useRef(null)

  // 🔄 曲が切り替わったら audio を手動で load（先読み）
  useEffect(() => {
    if (audioRef.current && currentPrivateSong) {
      audioRef.current.load()
    }
  }, [currentPrivateSong])

  useEffect(() => {
    if (!audioRef.current) return

    if (privateIsPlaying) {
      audioRef.current.play().catch(err => {
        console.warn('[GlobalAudio] failed to play:', err)
      })
    } else {
      audioRef.current.pause()
    }
  }, [privateIsPlaying, currentPrivateSong])

  useEffect(() => {
    if (privateSeekTime !== null && audioRef.current) {
      audioRef.current.pause() 
      audioRef.current.currentTime = privateSeekTime

      if (privateIsPlaying) {
        setTimeout(() => {
          audioRef.current.play().catch(err => console.warn('Autoplay error after seek:', err))
        }, 200)
      }

      dispatch(setPrivateSeekTime(null))
    }
  }, [dispatch, privateSeekTime, privateIsPlaying])

  useEffect(() => {
    if (!audioRef.current) return

    if (privateIsPlaying) {
      audioRef.current.play().catch(err => {
        console.warn('[GlobalAudio] failed to play:', err)
      })
    } else {
      audioRef.current.pause()
    }
  }, [privateIsPlaying])

  const getAudioSrc = (url) => {
    return url.startsWith('blob:') ? url : `${API_BASE_URL}/${url}`
  }

  const handleTimeUpdate = () => {
    dispatch(setPrivateCurrentTime(audioRef.current.currentTime))
  }

  const handleLoadedMetadata = () => {
    dispatch(setPrivateDuration(audioRef.current.duration))
  }

  if (!currentPrivateSong) {
    return null
  }

  return (
    <audio
      ref={audioRef}
      preload="auto" /* 先読みを促す */
      src={getAudioSrc(currentPrivateSong.audioUrl)}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
    />
  )
}

export default PrivateAudioPlayer
