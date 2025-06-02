import '../css/songList.css'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'

const SongList = ({ songs }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  console.log(id)

  if (!songs?.length && !id) return <p>No Songs</p>


  const handleOpenModal = (id) => {
    console.log('handleOpenModal')
    navigate(`/songs/modal/${id}`, { state: { background: location } }) // URLだけ変更
  }

  console.log('[SongList.songs]: ', songs)

  return (
    <ul className='song-list'>
      {songs.map(song => (
        <li key={song._id}>
          {console.log('[描画中のsong]', song)}
          {song.imageFile && (
            <button
              onClick={() => handleOpenModal(song._id)}
            >
              <img
                src={`http://localhost:3500/${song.imageFile}`}
                alt={song.title}
                className='song-image'
              />
            </button>
          )}
          <br />
          <div className='song-info'>
            <p className='song-info-title'>{song.title}</p>
            <div>
              {id === null || id !== song.user._id ? (
                <Link
                  to={`/users/${song.user._id}`}
                  className='song-info-user'
                >
                  <p>
                    {song.user.icon ? (
                      <img 
                        src={`http://localhost:3500/${song.user.icon}`} 
                        alt="icon" 
                        className='user-icon'
                      />
                    ) : (
                      <img 
                        src='http://localhost:3000/default_user_icon.jpg' 
                        alt="icon"
                        className='user-icon'
                      />
                    )}
                  </p>
                  <p className='song-info-username'>@{song.user.username}</p>
                </Link>
              ): null}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default SongList
