import { useState } from 'react'
import { useCreatePlaylistMutation } from './playlistApiSlice'
import { useNavigate } from 'react-router-dom'

const CreatePlaylist = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isPublic, setIsPublic] = useState(true)

  const [createPlaylist, { isLoading }] = useCreatePlaylistMutation()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim) {
      alert('Title is required')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('isPublic', isPublic)
    if (description) {
      formData.append('description', description)
    }
    if (coverImage) {
      formData.append('coverImage', coverImage)
    }

    try {
      await createPlaylist(formData).unwrap()
      alert('Playlist created successfully!')
      navigate('/playlists/mine') // または一覧ページ
    } catch (err) {
      console.error(err)
      alert('Failed to create playlist.')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setCoverImage(file)

    if (file) {
      const render = new FileReader()

      render.onloadend = () => {
        setPreviewUrl(render.result)
      }

      render.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="create-playlist-form">
      <h2>Create New Playlist</h2>

      <input
        type="text"
        placeholder="Playlist title: required"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>
        <input 
          type="file"
          accept='image/*'
          onChange={handleImageChange}
        />
      </label>

      {previewUrl &&
        <div>
          <img 
            src={previewUrl}
            alt="CoverImage Preview"
            style={{ width: '200px', aspectRatio: '1', objectFit: 'cover', margin: '10px' }}
          />
        </div>
      }

      <label>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        Public
      </label>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}

export default CreatePlaylist
