import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectNowPlaying,
  setCurrentTime,
  setDuration,
  setSeekTime,
} from './nowPlayingSlice'

const GlobalAudioPlayer = () => {
  const { currentSong, isPlaying, seekTime, volume, pausedSnapshot } = useSelector(selectNowPlaying)
  const isMiningActive = useSelector(state => state.ui.isMiningActive)
  const dispatch = useDispatch()
  const audioRef = useRef(null)

  // 🔄 曲が切り替わったら audio を手動で load（先読み）
  useEffect(() => {
    if (audioRef.current && currentSong) {
      console.log('[Audio] calling .load() for:', currentSong.title)
      audioRef.current.load()

      // 🔸 pausedSnapshot がある場合は、そこから再生開始する
      if (pausedSnapshot?.song?._id === currentSong._id && pausedSnapshot?.currentTime != null) {
        audioRef.current.onloadedmetadata = () => {
          console.log('[Audio] Resuming from snapshot time:', pausedSnapshot.currentTime)
          audioRef.current.currentTime = pausedSnapshot.currentTime
        }
      }
    }
  }, [currentSong, pausedSnapshot])

  useEffect(() => {
    if (!audioRef.current) return

    console.log('[Audio] isPlaying:', isPlaying)
    console.log('[Audio] currentSong:', currentSong)

    if (isPlaying) {
      console.log('[GlobalAudio] ▶ 再生')
      audioRef.current.play().catch(err => {
        console.warn('[GlobalAudio] play失敗:', err)
      })
    } else {
      console.log('[GlobalAudio] ⏸ 停止')
      audioRef.current.pause()
    }
  }, [isPlaying, currentSong])

  useEffect(() => {
    if (audioRef.current && volume !== undefined) {
      audioRef.current.volume = volume
      console.log('[Audio] Volume set to:', volume)
    }
  }, [volume])

  useEffect(() => {
    if (seekTime !== null && audioRef.current) {
      console.log('[GlobalAudioPlayer] seeking to:', seekTime)
      audioRef.current.pause() // 🔸 先に止めてから
      audioRef.current.currentTime = seekTime

      if (isPlaying) {
        setTimeout(() => {
          audioRef.current.play().catch(err => console.warn('Autoplay error after seek:', err))
        }, 200) // 🔸 少し遅らせてバッファ時間を確保
      }

      dispatch(setSeekTime(null))
    }
  }, [seekTime, isPlaying])

  useEffect(() => {
    if (!audioRef.current) return

    if (isMiningActive) {
      console.log('[GlobalAudio] ⛏ マイニング中 → 強制停止')
      audioRef.current.pause()
      return
    }

    if (isPlaying) {
      console.log('[GlobalAudio] ▶ 再生')
      audioRef.current.play().catch(err => {
        console.warn('[GlobalAudio] play失敗:', err)
      })
    } else {
      console.log('[GlobalAudio] ⏸ 停止')
      audioRef.current.pause()
    }
  }, [isPlaying, isMiningActive])

  const handleTimeUpdate = () => {
    dispatch(setCurrentTime(audioRef.current.currentTime))
  }

  const handleLoadedMetadata = () => {
    console.log('[Audio] Metadata loaded')
    dispatch(setDuration(audioRef.current.duration))
  }

  if (!currentSong) {
    console.log('[Audio] No currentSong → null audio')
    return null
  }

  return (
    <audio
      ref={audioRef}
      preload="auto" /* 🔥 先読みを促す */
      src={`http://localhost:3500/${currentSong.audioUrl}`}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
    />
  )
}

export default GlobalAudioPlayer
