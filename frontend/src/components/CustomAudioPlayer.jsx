import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setNowPlaying,
  togglePlay,
  selectNowPlaying,
  setVolume
} from '../features/player/nowPlayingSlice'
import { selectCurrentUser } from '../features/auth/authSlice'
import { usePlaySongMutation, songApi } from '../features/songs/songApiSlice'
import { useRecordPlayHistoryMutation } from '../features/playHistory/playHistoryApiSlice'
import '../css/customAudioPlayer.css'

const CustomAudioPlayer = ({ song }) => {
  const dispatch = useDispatch()
  const { currentSong, isPlaying, volume, duration, currentTime } = useSelector(selectNowPlaying)
  const currentUser = useSelector(selectCurrentUser)
  const [playSong] = usePlaySongMutation()
  const [recordPlayHistory] = useRecordPlayHistoryMutation()
  const ONE_HOUR = 60 * 60 * 1000

  const isCurrentSong = currentSong?._id === song._id

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || !isCurrentSong) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }  

  const handlePlayClick = async () => {
    console.log('[CustomAudioPlayer] Play button clicked')
    // 曲を切り替えるときは setNowPlaying
    if (!isCurrentSong) {
      console.log('[CustomAudioPlayer] Dispatching setNowPlaying')
      dispatch(setNowPlaying({
        _id: song._id,
        title: song.title,
        artistName: song.user?.username || 'Unknown',
        artistId: song.user?._id,
        audioUrl: song.audioFile,
        imageUrl: song.imageFile
      }))
    }
    
    console.log('[CustomAudioPlayer] Dispatching togglePlay')
    dispatch(togglePlay())

    if (!currentUser) return

    // 再生履歴などの処理
    const now = Date.now()
    const recentPlay = song.plays.find(p =>
      String(p.user) === String(currentUser._id) &&
      now - new Date(p.timestamp).getTime() < ONE_HOUR
    )

    try {
      await recordPlayHistory(song._id).unwrap()
      if (!recentPlay) {
        await playSong(song._id).unwrap()
        dispatch(
          songApi.util.updateQueryData('getSongById', song._id, draft => {
            draft.plays.push({
              user: currentUser._id,
              timestamp: new Date().toISOString()
            })
          })
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="custom-audio-player">
      <div className="top-row">
        <span className="current-time">{formatTime(currentTime)}</span>
  
        <button className="play-button" onClick={handlePlayClick}>
          {isCurrentSong && isPlaying ? '⏸' : '▶'}
        </button>
  
        <span className="duration">{formatTime(duration)}</span>
      </div>
  
      <input
        type="range"
        className="volume-slider"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => dispatch(setVolume(parseFloat(e.target.value)))}
      />
    </div>
  )  
}

export default CustomAudioPlayer
