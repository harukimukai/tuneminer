import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../css/searchForm.css'

const SearchForm = () => {
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [artist, setArtist] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const queryParams = new URLSearchParams()
    if (title) queryParams.append('title', title)
    if (genre) queryParams.append('genre', genre)
    if (artist) queryParams.append('artist', artist)

    navigate(`/search-results?${queryParams.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className='form'>
      <input type="text" className='search-form' placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" className='search-form' placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
      <input type="text" className='search-form' placeholder="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} />
      <button type="submit" className='search-button'>Search</button>
    </form>
  )
}

export default SearchForm
