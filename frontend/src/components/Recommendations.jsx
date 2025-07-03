import { useGetRecommendationsQuery } from '../features/songs/songApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import SongList from './SongList'
import '../css/modal.css'

const Recommendations = () => {
  const currentUser = useSelector(selectCurrentUser)
  const { data: recommendedSongs, isLoading, isError } = useGetRecommendationsQuery(currentUser._id)

  if (isLoading) return <p>Getting Recommendations</p>
  if (isError) return <p>Failed to get Recommendations</p>

  return (
    <div>
      {recommendedSongs?.length > 0 ? (
        <SongList songs={recommendedSongs} />
      ) : (
        <p>No Recommendations yet</p>
      )}
    </div>
  )
}

export default Recommendations