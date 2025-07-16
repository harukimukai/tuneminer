import React, { useState } from 'react'
import { useUploadSongMutation } from './songApiSlice'
import { useNavigate } from 'react-router-dom'
import '../../css/upload.css'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import { usePredictGenreMutation } from './genreApi'

const UploadSong = () => {
  const currentUser = useSelector(selectCurrentUser)
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [hidden, setHidden] = useState(false)
  const [original, setOriginal] = useState(false)
  const [audioFile, setAudioFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [highlightStart, setHighlightStart] = useState('')
  const [highlightEnd, setHighlightEnd] = useState('')
  const [message, setMessage] = useState(null)

  const navigate = useNavigate()

  const [uploadSong, { isLoading, isError, error }] = useUploadSongMutation()
  const [predictGenre] = usePredictGenreMutation()

  const handleFileChange = async (file) => {
    try {
      const result = await predictGenre(file).unwrap()
      console.log('ジャンル予測結果:', result.genre)
      setGenre(result.genre)  // ← 自動的にジャンル欄にセット！
    } catch (err) {
      console.error('ジャンル予測失敗:', err)
    }
  }  


  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('genre', genre)
    formData.append('lyrics', lyrics)
    formData.append('hidden', hidden)
    formData.append('original', original)
    formData.append('audioFile', audioFile)
    formData.append('imageFile', imageFile)
    formData.append('highlightStart', highlightStart)
    formData.append('highlightEnd', highlightEnd)

    try {
      const response = await uploadSong(formData).unwrap()
      console.log('Upload success:', response)
      setMessage('Uploaded!')
      setTitle('')
      setGenre('')
      setLyrics('')
      setHidden(false)
      setOriginal(false)
      setAudioFile(null)
      setImageFile(null)
      setHighlightStart('')
      setHighlightEnd('')
      navigate('/')
      alert('Uploaded a new song!')
    } catch (err) {
      console.error('Upload error:', err)
      setMessage('Failed to upload your song')
    }
  }

  const onImageClick = () => {
    document.getElementById('image-upload').click()
  }

  return (
    <section className="upload-modal-style">
      <div className="upload-left">
        <div className="upload-image" onClick={onImageClick}>
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="preview-img" />
          ) : (
            <div className="placeholder-text">Click to upload image</div>
          )}
          <input
            type="file"
            accept="image/*"
            id="image-upload"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImageFile(file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
            style={{ display: 'none' }}
          />
        </div>
        <div className="upload-meta">
          <div className="upload-user">@{currentUser?.username}</div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
          <div>
            <input
              type="checkbox"
              checked={hidden}
              onChange={(e) => setHidden(e.target.checked)}
            />
            <label>Private</label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={original}
              onChange={(e) => setOriginal(e.target.checked)}
            />
            <label>Original</label>
          </div>
        </div>
      </div>

      <form className="upload-right" onSubmit={handleSubmit}>
        <div className="lyrics-section">
          <label>Lyrics</label>
          <textarea
            placeholder="Lyrics Input"
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
          />
        </div>

        <div className="audio-section">
          <label>Audio File</label>
          <input
            type="file"
            accept=".mp3"
            onChange={(e) => {
              const file = e.target.files[0]
              if (file) {
                setAudioFile(file)
                handleFileChange(file)  // ← ここを追加！
              }
            }}
            required
          />
          {audioFile && <p>{audioFile.name}</p>}
        </div>

        <div className="diamond-time-box">
          <label>Diamond Time (seconds)</label>
          <div className="diamond-inputs">
            <div>
              <label>Start:</label>
              <input
                type="number"
                value={highlightStart}
                onChange={(e) => setHighlightStart(e.target.value)}
              />
            </div>
            <div className="play-button">▶︎</div>
            <div>
              <label>End:</label>
              <input
                type="number"
                value={highlightEnd}
                onChange={(e) => setHighlightEnd(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className='upload-btn'>
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </section>
  )
}

export default UploadSong
