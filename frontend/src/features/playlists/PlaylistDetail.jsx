import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useRemoveSongPlaylistMutation, useGetPlaylistByIdQuery } from './playlistApiSlice'
import { API_BASE_URL } from '../../config/constants'

const PlaylistDetail = () => {
  const { id } = useParams()
  const { data: playlist, isLoading } = useGetPlaylistByIdQuery(id)
  const [ removeSongPlaylist ] = useRemoveSongPlaylistMutation()
  const navigate = useNavigate()
  const location = useLocation()

  if (isLoading) return <p>Loading...</p>

  const handleOpenModal = (songId) => {
    navigate(`/songs/modal/${songId}`, { state: { background: location } }) // URLだけ変更
  }

  const handleRemoveSongPlaylist = async( playlistId, playlistTitle, songId, songTitle ) => {
    const confirm = window.confirm(`Are you sure to remove ${songTitle} from ${playlistTitle}?`)
    if (!confirm) return

    try {
      await removeSongPlaylist({ playlistId, songId}).unwrap()
      alert(`${songTitle} is removed from ${playlistTitle}!`)
    } catch (error) {
      console.error(error)
      alert(`${songTitle} could not be removed from ${playlistTitle}!`)
    }
  }

  return (
    <div>
      <h2>Title: {playlist.title}</h2>
      <p>Description: {playlist.description}</p>
      <Link to={`/playlists/${playlist._id}/edit`}>
        <button>Edit</button>
      </Link>
      <div style={{ display: 'flex', gap: '8px' }}>
        {playlist.songs.map((song) => (
          <div key={song._id}>
            <button onClick={() => handleOpenModal(song._id)}>
              <img src={`${API_BASE_URL}/${song.imageFile}`} alt={song.title} style={{height: '250px', aspectRatio: '1/1', objectFit: 'cover' , borderRadius: '8px'}} />
              <p>{song.title}</p>
            </button>
            <p>by {song.user?.username}</p>
            <button 
              onClick={() => handleRemoveSongPlaylist(playlist._id, playlist.title, song._id, song.title)}
            >
              ⊝
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlaylistDetail
