import React from 'react'
import { Link } from 'react-router-dom'
import SongList from '../components/SongList'
import { useGetAdminRecQuery, useGetAllSongsQuery } from '../features/songs/songApiSlice'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useSelector } from 'react-redux'
import Recommendations from '../components/Recommendations'
import '../css/dashBoard.css'

const Dashboard = () => {
    const { data: songs, isLoading } = useGetAllSongsQuery()
    const { 
      data: adminSongs = [],
      isLoading: isAdminSongsLoading
    } = useGetAdminRecQuery()

    const currentUser = useSelector(selectCurrentUser)

    if (isLoading) return <p>Loading...</p>
    if (isAdminSongsLoading) return <p>[Rec By Admin] Loading...</p>
    if (!currentUser) return <p>No user <Link to="/login">Login</Link></p>
  

    return (
        <section className='dash-board_container'>
            <h2>Dashboard</h2>
            <div>
                <p>Recommendations By Admin</p>
                <p>
                  <SongList songs={adminSongs} />
                </p>
            </div>
            <p>
                <Recommendations userId={currentUser._id}/>
            </p>
            <h3>Songs</h3>
            <p>
                <SongList songs={songs} />
            </p>
            
        </section>
  )
}

export default Dashboard
