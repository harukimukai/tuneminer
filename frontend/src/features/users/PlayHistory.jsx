import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import { useGetMyPlayHistoryQuery } from '../playHistory/playHistoryApiSlice'
import SongList from '../../components/SongList'

const PlayHistory = () => {
  const user = useSelector(selectCurrentUser)
  const { data: songs, isLoading, isError, error } = useGetMyPlayHistoryQuery(user._id)

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error: {error?.data?.message}</p>

  return (
    <section>
      <h2>{user.username}'s Play History</h2>
      <SongList songs={songs} />
    </section>
  )
}

export default PlayHistory
