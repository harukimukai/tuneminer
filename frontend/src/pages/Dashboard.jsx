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
    // if (!currentUser) return <p>No user <Link to="/login">Login</Link></p>
  

    return (
  <section className="dash-board_container">
    
    <div className="section-block">
      <h3>Recommendations By Admin</h3>
      <SongList songs={adminSongs} />
    </div>

    {currentUser && 
      <div className="section-block">
        <h3>Your Personalized Recommendations</h3>
        <Recommendations userId={currentUser._id} />
      </div>
    }

    <div className="section-block">
      <SongList songs={songs} />
    </div>
  </section>
);

}

export default Dashboard
