import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSearchSongsQuery } from './songApiSlice'
import SongList from '../../components/SongList'

const SearchResults = () => {
  const { search } = useLocation()
  const queryParams = Object.fromEntries(new URLSearchParams(search))
  const searchWord = search.split('?')[1]

  const { 
    data: results, 
    isLoading, 
    isError, 
    error 
  } = useSearchSongsQuery(queryParams)

  if (isLoading) return <p>Searching...</p>
  if (isError) return <p style={{ color: 'red' }}>{error?.data?.message || 'Searching error'}</p>

  return (
    <section>
      <h2>Search Results: {searchWord}</h2>
      {results?.length > 0
        ? <SongList songs={results} />
        : <p>No songs found</p>
      }
    </section>
  )
}

export default SearchResults
