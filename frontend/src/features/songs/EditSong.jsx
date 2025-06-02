import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetMySongsQuery, useUpdateSongMutation } from './songApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'

const EditSong = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: songs = [] } = useGetMySongsQuery()
  const song = songs.find(s => s._id === id)
  const currentUser = useSelector(selectCurrentUser)

  const [updateSong, { isLoading }] = useUpdateSongMutation()

  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [hidden, setHidden] = useState(false)
  const [audioFile, setAudioFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [highlightStart, setHighlightStart] = useState('')
  const [highlightEnd, setHighlightEnd] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (song) {
      setTitle(song.title)
      setGenre(song.genre)
      setLyrics(song.lyrics || '')
      setHighlightStart(song.highlightStart || '')
      setHighlightEnd(song.highlightEnd || '')
      if (song.highlight) {
        setHighlightStart(song.highlight.start.toString())
        setHighlightEnd(song.highlight.end.toString())
      }
    }
  }, [song])

  useEffect(() => {
    if (song?.hidden) {
      setHidden(true)
    }
  }, [song])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('genre', genre)
    formData.append('lyrics', lyrics)
    formData.append('hidden', hidden)
    formData.append('highlightStart', highlightStart)
    formData.append('highlightEnd', highlightEnd)
    if (audioFile) formData.append('audioFile', audioFile)
    if (imageFile) formData.append('imageFile', imageFile)

    try {
      await updateSong({ id, formData }).unwrap()
      navigate(`/users/${currentUser._id}`)
    } catch (err) {
      console.error('Failed to update:', err)
      setMessage('Failed to update')
    }
  }

  if (!song) return <p>Couldn't find the song</p>

  return (
    <section>
      <h2>Edit Song</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input value={title} style={{color: "grey"}} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <br />

        <label>
          Genre:
          <input value={genre} style={{color: "grey"}} onChange={(e) => setGenre(e.target.value)} required />
        </label>
        <br />

        <label>
          Lyrics:
          <textarea value={lyrics} style={{color: "grey"}} onChange={(e) => setLyrics(e.target.value)} />
        </label>
        <br />

        <label>
          Audio File (mp3):
          <input 
            type="file"
            accept='.mp3'
            onChange={(e) => setAudioFile(e.target.files[0])}
          />
        </label>
        <br />

        <label>
          Diamond Time Start (seconds):
          <input
            type="number"
            style={{color: "grey"}}
            min="0"
            value={highlightStart}
            onChange={(e) => setHighlightStart(e.target.value)}
          />
        </label>

        <label>
          Diamond Time End (seconds):
          <input
            type="number"
            style={{color: "grey"}}
            min="0"
            value={highlightEnd}
            onChange={(e) => setHighlightEnd(e.target.value)}
          />
        </label>
        <br />

        <label>
          Image File (jpg/png/webp):
          <input 
            type="file"
            accept='image/*'
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={hidden}
            onChange={(e) => setHidden(e.target.checked)}
          />
            Private
        </label>
        <br />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update'}
        </button>
      </form>
    </section>
  )
}

export default EditSong
