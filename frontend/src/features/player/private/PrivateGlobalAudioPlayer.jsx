import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  selectPrivateAudio, 
  setPrivateCurrentTime, 
  setPrivateDuration, 
  setPrivateIsPlaying, 
  setPrivateSeekTime 
} from './privateAudioSlice'
import { setPrivateMode } from '../../mining/uiSlice'
import { pauseAndSaveSnapshot, resumeFromSnapshot } from '../nowPlayingActions'
import { API_BASE_URL } from '../../../config/constants'

const PrivateAudioPlayer = () => {
  const { currentPrivateSong, privateIsPlaying, privateSeekTime } = useSelector(selectPrivateAudio)
  const isPrivateMode = useSelector(state => state.ui.isPrivateMode)
  const dispatch = useDispatch()
  const audioRef = useRef(null)

  // 🔄 曲が切り替わったら audio を手動で load（先読み）
  useEffect(() => {
    if (audioRef.current && currentPrivateSong) {
      console.log('[Audio] calling .load() for:', currentPrivateSong.title)
      audioRef.current.load()
    }
  }, [currentPrivateSong])

  useEffect(() => {
    if (!audioRef.current) return

    console.log('[Audio] isPlaying:', privateIsPlaying)
    console.log('[Audio] currentSong:', currentPrivateSong)

    if (privateIsPlaying) {
      console.log('[GlobalAudio] ▶ 再生')
      audioRef.current.play().catch(err => {
        console.warn('[GlobalAudio] play失敗:', err)
      })
    } else {
      console.log('[GlobalAudio] ⏸ 停止')
      audioRef.current.pause()
    }
  }, [privateIsPlaying, currentPrivateSong])

  useEffect(() => {
    if (privateSeekTime !== null && audioRef.current) {
      console.log('[GlobalAudioPlayer] seeking to:', setPrivateSeekTime)
      audioRef.current.pause() // 🔸 先に止めてから
      audioRef.current.currentTime = privateSeekTime

      if (privateIsPlaying) {
        setTimeout(() => {
          audioRef.current.play().catch(err => console.warn('Autoplay error after seek:', err))
        }, 200) // 🔸 少し遅らせてバッファ時間を確保
      }

      dispatch(setPrivateSeekTime(null))
    }
  }, [privateSeekTime, privateIsPlaying])

  useEffect(() => {
    if (!audioRef.current) return

    if (privateIsPlaying) {
      console.log('[GlobalAudio] ▶ 再生')
      audioRef.current.play().catch(err => {
        console.warn('[GlobalAudio] play失敗:', err)
      })
    } else {
      console.log('[GlobalAudio] ⏸ 停止')
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
    console.log('[Audio] Metadata loaded')
    dispatch(setPrivateDuration(audioRef.current.duration))
  }

  if (!currentPrivateSong) {
    console.log('[Audio] No currentSong → null audio')
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
