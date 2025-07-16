import { useSelector } from "react-redux"
import { selectCurrentUser } from "../features/auth/authSlice"
import { Link } from "react-router-dom"
import { useGetAdminRecQuery } from "../features/songs/songApiSlice"
import SongList from "../components/SongList"
import ReportedSongs from "../features/report/ReportedSongs"

const AdminDashboard = () => {
    const currentUser = useSelector(selectCurrentUser)
    const {data: adminSongs} = useGetAdminRecQuery()
  
    if (!currentUser?.isAdmin) {
      return <h1>You are not allowed to access</h1>
    }
  
    return (
      <div>
        <h1>Admin Dashboard</h1>
        <ul>
          <h1>Admin recommend Songs</h1>
          <li><SongList songs={adminSongs} /></li>
          <h1>Reported Songs</h1>
          <li><ReportedSongs /></li>
        </ul>
      </div>
    )
  }
  
  export default AdminDashboard
  