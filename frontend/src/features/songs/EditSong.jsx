import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useGetMySongsQuery, useUpdateSongMutation } from './songApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import Waveform from '../../components/Waveform'
import CustomAudioPlayer from '../../components/CustomAudioPlayer'

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

  const onClose = () => {
    navigate('-1')
  }

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
      <form onSubmit={handleSubmit}>
        {message && <p style={{ color: 'red' }}>{message}</p>}
        <div className="modal-overlay">
          <div className="modal-container">
            <button className="modal-close" onClick={onClose}>✕</button>
            <div className="modal-content">
              <div className="modal-left">
                <p className='createdAt'>
                  <h2>Edit Song</h2>
                </p>
                {song.imageFile && (
                  <div className='song-modal-image-box'>
                    <img 
                      src={`http://localhost:3500/${song.imageFile}`} 
                      alt={song.title}
                      className="song-modal-image"
                    />
                  </div>
                )}
                <label className="song-title">Title:
                  <input value={title} style={{color: "grey"}} onChange={(e) => setTitle(e.target.value)} required />
                </label>
                <div className="links">
                  {song.user?._id && (
                      <Link to={`/users/${song.user._id}`} className='song-artist'>
                        {song.user.icon ? (
                          <img src={`http://localhost:3500/${song.user.icon}`} alt="icon" />  
                        ) : (
                          <img src='http://localhost:3000/default_user_icon.jpg' alt="icon" />
                        )}
                        <span>@{song.user.username}</span>
                      </Link>
                  )}
                  <div className='song-artist'>     
                    <label>
                      Genre:
                      <input value={genre} style={{color: "grey"}} onChange={(e) => setGenre(e.target.value)} required />
                    </label>
                  </div>
                </div>
                <label>
                  <input
                    type="checkbox"
                    checked={hidden}
                    onChange={(e) => setHidden(e.target.checked)}
                  />
                    Private
                </label>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update'}
                </button>
              </div>
              <div className="modal-right">
                <div className="lyrics-box">
                  <label>
                    Lyrics:
                    <textarea 
                      value={lyrics} 
                      style={{color: "grey"}} 
                      onChange={(e) => setLyrics(e.target.value)} 
                      className="w-full max-h-[350px] min-h-[350px] overflow-y-auto #4a4a4a rounded p-8 text-sm"
                    />
                  </label>
                </div>
                <Waveform
                  audioUrl={`http://localhost:3500/${song.audioFile}`}
                  songId={song._id}
                />
                <label>Diamond Time(secs)</label>
                <div>
                  <input
                    type="number"
                    style={{color: "grey", width: "50px"}}
                    min="0"
                    value={highlightStart}
                    onChange={(e) => setHighlightStart(e.target.value)}
                  />s
                  ~
                  <input
                    type="number"
                    style={{color: "grey", width: "50px"}}
                    min="0"
                    value={highlightEnd}
                    onChange={(e) => setHighlightEnd(e.target.value)}
                  />s
                </div>
                <CustomAudioPlayer
                  song={song}
                  id={id}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <form onSubmit={handleSubmit}>

        <label>
          Image File (jpg/png/webp):
          <input 
            type="file"
            accept='image/*'
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>
      </form>
    </section>
  )
}

export default EditSong
