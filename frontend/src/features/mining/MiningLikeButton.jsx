import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import { useAddMiningLikeMutation, useGetMiningLikesBySongQuery, useRemoveMiningLikeMutation } from './miningApiSlice'
import '../../css/miningButton.css'

const MiningLikeButton = ({ songId }) => {
  const currentUser = useSelector(selectCurrentUser)
  const {data: miningLikes = []} = useGetMiningLikesBySongQuery(songId)
  const [addMiningLike] = useAddMiningLikeMutation()
  const [removeMiningLike] = useRemoveMiningLikeMutation()
  const [isLiked, setIsLiked] = useState(false)

  console.log('miningLikes:', miningLikes)

  useEffect(() => {
    console.log('miningLikes:', miningLikes)
    console.log('currentUser:', currentUser)

    if (!miningLikes || !Array.isArray(miningLikes)) return console.log('could not get miningLikes')

    if (miningLikes.some((miningLike) => miningLike.user._id.toString() === currentUser._id.toString())) {
      setIsLiked(true)
      console.log('setIsLiked(true)')
    } else {
      setIsLiked(false)
       console.log('setIsLiked(false)')
    }
  }, [miningLikes, currentUser])

  const handleMiningLike = async() => {
    try {
      if (!isLiked) {
        await addMiningLike(songId)
        setIsLiked(true)
        alert('Found a diamond!')
      } else {
        await removeMiningLike(songId)
        setIsLiked(false)
        alert('Tossed a diamond!')
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div>
        <button onClick={handleMiningLike}>
          {isLiked ? (
            <div>
              💎
            </div>
          ) : (
            <div className='diamond__unliked'>💎</div>
          )}
        </button>

    </div>
  )
}

export default MiningLikeButton