import React from 'react'
import { useGetMyMiningHistoryQuery } from './miningApiSlice'
import SongList from '../../components/SongList' // 使い回せる場合
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
// または個別に表示する場合は独自のカードでもOK

const MiningHistory = () => {
  const currentUser = useSelector(selectCurrentUser)
  const { data: history, isLoading, isError, error } = useGetMyMiningHistoryQuery(currentUser._id)

  if (isLoading) return <p>Loading mining history...</p>
  if (isError) return <p style={{ color: 'red' }}>{error?.data?.message || 'Failed to load history'}</p>
  if (!history?.length) return <p>No mining history yet.</p>

  console.log(history)

  return (
    <section>
      <h2>Your Mining History</h2>
      <SongList songs={history} />
      {/* またはカスタムカードで個別表示 */}
    </section>
  )
}

export default MiningHistory
