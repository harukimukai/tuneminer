import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import '../css/customAudioPlayer.css'
import { privateTogglePlay, selectPrivateAudio, setCurrentPrivateSong } from '../features/player/private/privateAudioSlice'

const PrivateCustomAudioPlayer = ({ song }) => {
  const dispatch = useDispatch()
  const { currentPrivateSong, privateIsPlaying, privateDuration, privateCurrentTime } = useSelector(selectPrivateAudio)
  const currentUser = useSelector(selectCurrentUser)

  const isCurrentSong = currentPrivateSong?._id === song._id

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || !isCurrentSong) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }  

  const handlePlayClick = () => {
    if (!isCurrentSong) {
      dispatch(setCurrentPrivateSong({
        _id: song._id,
        title: 'プレビュー中',
        artistName: 'You',
        artistId: 'preview_user',
        audioUrl: song.audioFile,
        imageUrl: '' // 画像なし
      }))
    }
    dispatch(privateTogglePlay())
  }

  return (
    <div className="custom-audio-player">
      <div className="top-row">
        <span className="current-time">{formatTime(privateCurrentTime)}</span>
  
        <button className="play-button" onClick={handlePlayClick} type='button'>
          {isCurrentSong && privateIsPlaying ? '⏸' : '▶'}
        </button>
  
        <span className="duration">{formatTime(privateDuration)}</span>
      </div>
    </div>
  )  
}

export default PrivateCustomAudioPlayer