import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import WaveSurfer from 'wavesurfer.js'
import { selectNowPlaying, setSeekTime } from '../features/player/nowPlayingSlice'

// v7
const Waveform = ({ audioUrl, songId }) => {
  const waveformRef = useRef(null)
  const wavesurferRef = useRef(null)
  const { currentTime, currentSong } = useSelector(selectNowPlaying)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!waveformRef.current || !audioUrl) return
  
    // 前の波形破棄
    try {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
        wavesurferRef.current = null
      }
    } catch (e) {
      console.warn('Wavesurfer destroy error:', e)
    }
  
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#aaa',
      progressColor: '#f43f5e',
      cursorColor: '#000',
      barWidth: 2,
      height: 60,
      responsive: true,
      interact: true,           // ← ✅ これがないとクリック無効な場合がある
      cursorWidth: 2
    })
  
    wavesurfer.load(audioUrl)
    wavesurferRef.current = wavesurfer
  
    // ✅ seekイベントを "ready" 後に登録
    wavesurfer.on('ready', () => {
      wavesurfer.on('interaction', () => {
        const newTime = wavesurfer.getCurrentTime() // ← v7 で追加されたメソッド
        dispatch(setSeekTime(newTime))
      })
    })
  
    return () => {
      wavesurfer.destroy()
      wavesurferRef.current = null
    }
  }, [audioUrl, dispatch])
  

  // ✅ 再生位置をWaveSurfer側にも反映（毎秒更新）
  useEffect(() => {
    const wavesurfer = wavesurferRef.current
    if (songId !== currentSong?._id) return

    if (wavesurfer && wavesurfer.getDuration() > 0) {
      const progress = currentTime / wavesurfer.getDuration()
      wavesurfer.seekTo(progress)
    }
  }, [currentTime, songId, currentSong])

  return <div ref={waveformRef} style={{ width: '100%', height: '12%' }} />
}

export default Waveform
