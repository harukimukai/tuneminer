import { useParams } from 'react-router-dom'
import { useGetPlaylistByIdQuery } from './playlistApiSlice'

const PlaylistDetail = () => {
  const { id } = useParams()
  const { data: playlist, isLoading } = useGetPlaylistByIdQuery(id)

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <h2>Title: {playlist.title}</h2>
      <p>Description: {playlist.description}</p>
      {/* 曲一覧など */}
    </div>
  )
}

export default PlaylistDetail
