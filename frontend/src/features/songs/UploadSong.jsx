import { useEffect, useState } from 'react'
import { useUploadSongMutation } from './songApiSlice'
import { useNavigate } from 'react-router-dom'
import '../../css/upload.css'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
// import { usePredictGenreMutation } from './genreApi'
import PrivateCustomAudioPlayer from '../../components/PrivateCustomAudioPlayer'
import { setPrivateMode } from '../mining/uiSlice'
import { pauseAndSaveSnapshot, resumeFromSnapshot } from '../player/nowPlayingActions'
import PrivateWaveform from '../../components/PrivateWaveform'
import { setPrivateIsPlaying } from '../player/private/privateAudioSlice'

const UploadSong = () => {
  const currentUser = useSelector(selectCurrentUser)
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [hidden, setHidden] = useState(false)
  const [original, setOriginal] = useState(false)
  const [audioFile, setAudioFile] = useState(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [highlightStart, setHighlightStart] = useState('')
  const [highlightEnd, setHighlightEnd] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [uploadSong, { isLoading }] = useUploadSongMutation()
  // const [predictGenre] = usePredictGenreMutation()

  // PrivateGlobalAudioPlayerじゃダメ。この画面に遷移したときにsetPrivateMode(true)にしないといけない。Applayout.jsで常に監視してるPrivateGlobalAudioPlayerにこれを記述すると、常に isPrivate === true になってしまう。
  useEffect(() => {
    dispatch(setPrivateMode(true))
    dispatch(pauseAndSaveSnapshot())
    return () => {
      dispatch(setPrivateMode(false))
      dispatch(resumeFromSnapshot())
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(setPrivateIsPlaying(false))  
  }, [dispatch, audioFile])

  // const handleFileChange = async (file) => {
  //    try {
  //      const result = await predictGenre(file).unwrap()
  //      console.log('ジャンル予測結果:', result.genre)
  //      setGenre(result.genre)  // ← 自動的にジャンル欄にセット！
  //    } catch (err) {
  //      console.error('ジャンル予測失敗:', err)
  //    }
  // }  

  const handleAudioChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
      return
    }
    setAudioFile(file)
    setAudioPreviewUrl(URL.createObjectURL(file))
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
      await uploadSong(formData).unwrap()
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
      alert('Failed to upload your song!')
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
          <label className="audio-file-select">
            Audio File
            <input
              type="file"
              accept=".mp3"
              onChange={handleAudioChange}
              style={{ display: 'none' }}
              required
            />
            {audioFile && <p>{audioFile.name}</p>}
          </label>
        </div>

        <div className="diamond-time-box">
          <label>Diamond Time (seconds)</label>
          <div className='private-waveform'>
            {audioPreviewUrl && (
              <PrivateWaveform
                audioUrl={`${audioPreviewUrl}`}
                songId={audioFile?.name}
              />
            )}
          </div>
          <div className="diamond-inputs">
            <div>
              <label>Start:</label>
              <input
                type="number"
                value={highlightStart}
                onChange={(e) => setHighlightStart(e.target.value)}
              />
            </div>
            {audioPreviewUrl && (
              <>
                <PrivateCustomAudioPlayer
                  song={{
                    _id: audioFile?.name,
                    title: 'Preview Song',
                    user: { username: currentUser.username, _id: currentUser._id },
                    audioFile: audioPreviewUrl,
                    imageFile: null
                  }}
                />
              </>
            )}

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
