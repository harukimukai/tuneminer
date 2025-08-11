import { useEffect, useRef, useState } from 'react'
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
  const currentUser = useSelector(selectCurrentUser)

  const [songs, setSongs] = useState([])
  const [index, setIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)
  const timeoutRef = useRef(null)
  const rafRef = useRef(null)
  const recordMiningRef = useRef(recordMining)

  const song = songs[index]

  // 初回セット
  useEffect(() => {
    if (miningSongs.length && songs.length === 0) {
      setSongs(miningSongs)
    }
  }, [miningSongs, songs.length])

  // currentTime初期化
  useEffect(() => {
    if (song?.highlight?.start != null) {
      setCurrentTime(song.highlight.start)
    }
  }, [song])

  // 再生処理
  useEffect(() => {
    if (!started || !song || !audioRef.current) return

    const audio = audioRef.current
    const { start, end } = song.highlight
    const waitTime = (end - start) * 1000

    const startPlayback = async () => {
      try {
        audio.currentTime = start
        setCurrentTime(start)
        await audio.play()
      } catch (err) {
        console.error('[❌] audio.play() Failed:', err)
      }
    }

    const updateCurrentTime = () => {
      if (audio && !audio.paused) {
        const now = audio.currentTime
        setCurrentTime(now)

        if (now >= end) {
          audio.pause()
          audio.currentTime = 0
          if (index >= songs.length - 1) {
            setFinished(true)
          } else {
            setIndex(prev => prev + 1)
          }
          return
        }

        rafRef.current = requestAnimationFrame(updateCurrentTime)
      }
    }

    const onPlay = async() => {
      try {
        await recordMiningRef.current(song._id).unwrap()
      } catch (err) {
        console.error('[❌] recordMining failed:', err)
      }

      rafRef.current = requestAnimationFrame(updateCurrentTime)

      timeoutRef.current = setTimeout(() => {
        audio.pause()
        audio.currentTime = 0
        if (index >= songs.length - 1) {
          setFinished(true)
        } else {
          setIndex(prev => prev + 1)
        }
      }, waitTime)
    }

    const onPause = () => {
      clearTimeout(timeoutRef.current)
      cancelAnimationFrame(rafRef.current)
    }

    // 再生開始
    startPlayback()

    // イベントリスナー追加
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      clearTimeout(timeoutRef.current)
      cancelAnimationFrame(rafRef.current)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [started, index, song, songs.length])

  // マイニングモード制御
  useEffect(() => {
    dispatch(setMiningActive(true))
    dispatch(pauseAndSaveSnapshot())
    return () => {
      dispatch(setMiningActive(false))
      dispatch(resumeFromSnapshot())
    }
  }, [dispatch])

  // いいね制御
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
    if (index > 0) setIndex(prev => prev - 1)
  }

  const handleNext = () => {
    if (index < songs.length - 1) {
      setIndex(prev => prev + 1)
    } else {
      setFinished(true)
    }
  }

  if (isLoading) return <p>Loading Mining...</p>
  if (!songs.length) return <p>No mining tracks found.</p>

  if (!started) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Ready to start mining?</h2>
        <button onClick={() => setStarted(true)}>Start Mining</button>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {!finished ? (
        <SongDetailLite
          song={song}
          index={index}
          miningMode={true}
          onLikeToggle={handleLikeToggle}
          onPrev={handlePrev}
          onNext={handleNext}
          audioRef={audioRef}
        />
      ) : (
        <p>No More Mining</p>
      )}
    </div>
  )
}

export default MiningPage
