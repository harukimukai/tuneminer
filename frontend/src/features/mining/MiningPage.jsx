import React, { useEffect, useRef, useState } from 'react'
import { useGetMiningSongsQuery } from '../songs/songApiSlice'
import SongDetailLite from '../../components/SongDetailLite'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import { useRecordMiningMutation } from './miningApiSlice'
import { setMiningActive } from './uiSlice'
import { pauseAndSaveSnapshot, resumeFromSnapshot } from '../player/nowPlayingActions'


const MiningPage = () => {
  const { data: miningSongs = [], isLoading } = useGetMiningSongsQuery()
  const [recordMining] = useRecordMiningMutation()
  const dispatch = useDispatch()
  const [songs, setSongs] = useState([])
  const [index, setIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const audioRef = useRef(null)
  const timeoutRef = useRef(null)
  const recordMiningRef = useRef(recordMining)
  const currentUser = useSelector(selectCurrentUser)
  const song = songs[index]

  useEffect(() => {
    if (miningSongs.length && songs.length === 0) {
      setSongs(miningSongs)
    }
  }, [miningSongs, songs.length])

  useEffect(() => {
    if (!started || !song || !audioRef.current) return

    const { start, end } = song.highlight
    const audio = audioRef.current
    const waitTime = (end - start) * 1000

    const startPlayback = async () => {
      try {
        audio.currentTime = start
        await audio.play()
        console.log('[▶] 再生開始 from', start)
      } catch (err) {
        console.error('[❌] audio.play() 失敗:', err)
      }
    }

    const onPlay = () => {
      console.log('[✅] onPlay → setTimeout を開始:', waitTime, 'ms')

      timeoutRef.current = setTimeout(async () => {
        console.log('[⌛] setTimeout 発動 → 停止')
        audio.pause()
        audio.currentTime = 0

        try {
          await recordMiningRef.current(song._id).unwrap()
        } catch (err) {
          console.error('[❌] recordMining失敗:', err)
        }

        if (index >= songs.length - 1) {
          setFinished(true)
        } else {
          setIndex(prev => prev + 1)
        }
      }, waitTime)
    }

    const onPause = () => {
      console.log('[🛑] audio が pause → setTimeout を解除')
      clearTimeout(timeoutRef.current)
    }

    startPlayback()
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      console.log('[🧹 cleanup] timeout + event listener 削除')
      clearTimeout(timeoutRef.current)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [started, index, song, songs.length])

  useEffect(() => {
    dispatch(setMiningActive(true))
    dispatch(pauseAndSaveSnapshot())

    return () => {
      dispatch(setMiningActive(false))
      dispatch(resumeFromSnapshot())
    }
  }, [dispatch])





  const handleLikeToggle = (songId, wasLiked) => {
    setSongs(prev =>
      prev.map(song =>
        song._id === songId
          ? {
              ...song,
              likes: wasLiked
                ? song.likes.filter(id => id !== currentUser._id)
                : [...song.likes, currentUser._id]
            }
          : song
      )
    )
  }

  const handlePrev = () => {
    if (index === 0) return
    setIndex(prev => prev - 1)
  }

  const handleNext = () => {
    if (index >= songs.length - 1) {
      setFinished(true)
    } else {
      setIndex(prev => prev + 1)
    }
  }

  if (isLoading) return <p>Loading Mining...</p>
  if (!songs.length) return <p>No mining tracks found.</p>
  console.log('🎧 mining songs:', miningSongs)
  if (!started) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Ready to start mining?</h2>
        <button onClick={() => setStarted(true)}>Start Mining</button>
      </div>
    )
  }

  let content
  if (!finished) {
    content = (
      <div style={{ textAlign: 'center' }}>
        <h2>🎧 Now Mining...</h2>
        <SongDetailLite 
          song={song}
          index={index}
          miningMode
          onLikeToggle={handleLikeToggle}
          onPrev={handlePrev}
          onNext={handleNext}
          audioRef={audioRef}
        />
      </div>
    )
  } else {
    content = (
      <div style={{ textAlign: 'center' }}>
        <p>No More Mining</p>
      </div>
    )
  }

  return content
}

export default MiningPage