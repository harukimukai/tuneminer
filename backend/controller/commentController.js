const asyncHandler = require('express-async-handler')
const Comment = require('../model/Comment')
const eventBus = require('../utils/eventBus')
const Song = require('../model/Song')
const User = require('../model/User')

// get comments
const getCommentsBySong = asyncHandler(async (req, res) => {
    console.log('get comment Start')
    const { songId } = req.params
    console.log('songId: ', songId)
  
    const comments = await Comment.find({ song: songId })
      .populate('user', 'username icon')
      .sort({ timestamp: 1 }) // 昇順
    res.json(comments)
  })

// create a comment
const createComment = asyncHandler(async (req, res) => {
    console.log('create comment Start')
    const userId = req._id
    const { songId, content, parent } = req.body
    if (!songId || !content) return res.status(404).json({ message: 'SongId and content are required!'})

    // 👇 parent が指定されている場合は存在確認する
    if (parent) {
        const parentComment = await Comment.findById(parent)
        if (!parentComment) {
            return res.status(404).json({ message: 'Parent comment not found' })
        }
    }

    const newComment = await Comment.create({
        user: userId,
        song: songId,
        content,
        parent: parent || null
    })

    const populated = await newComment.populate('user', 'username icon')

    const song = await Song.findById(songId)
    const user = await User.findById(userId)

    if (String(song.user._id) !== String(userId)) {
         eventBus.emit('commentCreated', {
            recipientId: song.user._id,
            senderId: userId,
            songId,
            content: parent
                ? `@${user.username} replyed your comment on '${song.title}'!`
                : `@${user.username} commented your song '${song.title}'!`
        })
    }

    res.status(201).json(populated)
}) 

// delete a comment
const deleteComment = asyncHandler(async (req, res) => {
    console.log('deleteComment Start')
    const userId = req._id
    const { id } = req.params

    const comment = await Comment.findById(id)
    if (!comment) return res.status(404).json({ message: 'Comment not found'})

    if (comment.user.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to delete this comment' })
    }

    await comment.deleteOne()
    res.json({ message: 'Comment deleted'})
})

module.exports = {
    getCommentsBySong,
    createComment,
    deleteComment
}