import React from 'react'
import { useGetSongReportsQuery } from './reportApiSlice'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const ReportedSongs = () => {
  const {data: reportedSongs = [] } = useGetSongReportsQuery()
  const navigate = useNavigate()
  const location = useLocation()

  const handleOpenModal = (id) => {
    console.log('handleOpenModal')
    navigate(`/songs/modal/${id}`, { state: { background: location } }) // URLだけ変更
  }

  return (
    <div>
      {!reportedSongs?.length ? (
        <p>No Reported Songs</p>
      ) : (
        <ul>
          {reportedSongs?.map((reportedSong) => (
            <div>
              <button onClick={handleOpenModal(reportedSong.song._id)}>Song Title: {reportedSong.song.title}</button>
              <p>Reporter: {reportedSong.user.username}</p>
              <p>Content: {reportedSong.content}</p>
            </div>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ReportedSongs