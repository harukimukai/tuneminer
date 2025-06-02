import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsBySongQuery
} from './commentApiSlice'
import { buildCommentTree } from '../../utils/commentUtils'

const CommentItem = ({ comment, onDelete, currentUser, onReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim()) return
    await onReply(comment._id, replyText)
    setReplyText('')
    setShowReplyForm(false)
  }

  return (
    <li style={{ marginBottom: '1rem' }}>
      <strong>{comment.user.username}</strong>: {comment.content}
      <br />
      <small>{new Date(comment.timestamp).toLocaleDateString()}</small>
      <div>
        {currentUser?._id === comment.user._id && (
          <button onClick={() => onDelete(comment._id)}>delete</button>
        )}
        {currentUser && (
          <button onClick={() => setShowReplyForm((prev) => !prev)}>
            {showReplyForm ? 'Cancel' : 'Reply'}
          </button>
        )}
      </div>

      {showReplyForm && (
        <form onSubmit={handleReply}>
          <textarea
            style={{ backgroundColor: 'grey'}}
            rows="2"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            required
          />
          <button type="submit">Post Reply</button>
        </form>
      )}

      {comment.replies?.length > 0 && (
        <ul style={{ marginLeft: '1rem' }}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onDelete={onDelete}
              currentUser={currentUser}
              onReply={onReply}
            />
          ))}
        </ul>
      )}
    </li>
  )
}


const CommentSection = ({ songId }) => {
  const currentUser = useSelector(selectCurrentUser)
  const [newComment, setNewComment] = useState('')
  const [createComment] = useCreateCommentMutation()
  const [deleteComment] = useDeleteCommentMutation()

  const {
    data: comments = [],
    isLoading,
    isError,
    error
  } = useGetCommentsBySongQuery(songId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await createComment({ songId, content: newComment }).unwrap()
      setNewComment('')
    } catch (err) {
      console.error('Failed to post comment:', err)
    }
  }

  const handleReply = async (parentId, replyContent) => {
    try {
      await createComment({ songId, content: replyContent, parent: parentId }).unwrap()
    } catch (err) {
      console.error('Failed to post reply:', err)
    }
  }

  const threadedComments = buildCommentTree(comments)
  console.log('🪵 threadedComments:', threadedComments)

  return (
    <section>
      <h3>Comments</h3>
      {currentUser && (
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <textarea
            style={{ backgroundColor: 'grey'}}
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
          />
          <button type="submit">Post</button>
        </form>
      )}
      {isLoading && <p>Loading comments...</p>}
      {isError && <p style={{ color: 'red' }}>{error?.data?.message || 'Failed to load comments'}</p>}

      {threadedComments.length > 0 ? (
        <ul>
          <p>{comments.length} Comments</p>
          {threadedComments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              onDelete={deleteComment}
              onReply={handleReply}
              currentUser={currentUser}
            />
          ))}
        </ul>
      ) : (
        <p>No Comments</p>
      )}
    </section>
  )
}

export default CommentSection
