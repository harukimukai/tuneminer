import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetPlaylistByIdQuery, useUpdatePlaylistMutation } from './playlistApiSlice'

const EditPlaylist = () => {
  const { id } = useParams()
  const {data: playlist} = useGetPlaylistByIdQuery(id)
  const [updatePlaylist, { isLoading }] = useUpdatePlaylistMutation()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    if (playlist) {
      setTitle(playlist.title)
      setDescription(playlist.description)
    }
  }, [playlist])

  useEffect(() => {
    if (playlist?.isPublic) {
      setIsPublic(true)
    }
  }, [playlist])

  const handleSubmit = async(e) => {
    e.preventDefault()
    console.log(title, description, isPublic)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('isPublic', isPublic)
    if (coverImage) formData.append('coverImage', coverImage)

    try {
      await updatePlaylist({ formData, id }).unwrap()
      navigate(`/playlists/${id}`)
    } catch (error) {
      console.error(error)
      alert('Failed to update the playlist')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* <label>Cover Image</label>
        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /> */}
        <label>Title</label>
        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /><br />
        <label>Description</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /><br />
        <label>Public</label>
        <input 
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        /><br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  )
}

export default EditPlaylist