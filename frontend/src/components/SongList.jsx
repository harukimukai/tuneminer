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

  // 1段5枚ずつ区切る（例）
  const chunked = [];
  for (let i = 0; i < songs.length; i += 5) {
    chunked.push(songs.slice(i, i + 5));
  }

  return (
    <>
    <div className="record-shelf-wall">
      {chunked.map((row, i) => (
        <div className="record-shelf" key={i}>
          <div className="record-shelf-board" />
          <div className="record-row">
            {row.map((song) => (
              <div className="record-card" key={song._id}>
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
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    </>
  )
}

export default SongList
