const asyncHandler = require('express-async-handler')
const PlayHistory = require('../model/PlayHistory')

const recordPlayHistory = asyncHandler(async (req, res) => {
    console.log('recordPlayHistory Start')
    const userId = req._id
    const { songId } = req.params
    if (!userId || !songId) {
        return res.status(400).json({ message: 'User ID and Song ID are required' })
    }

    const existing = await PlayHistory.findOne({ user: userId, song: songId})
    if (existing) {
        existing.lastPlayed = Date.now()
        await existing.save()
        return res.status(200).json({ message: 'playHistory updated'})
    }

    await PlayHistory.create({
        user: userId,
        song: songId,
        lastPlayed: Date.now()
    })

    res.status(201).json({ message: 'playHistory recorded'})
})

const getPlayHistory = asyncHandler(async (req, res) => {
    console.log('getPlayHistory Start')
    const { userId } = req.params
    if (!userId) return res.status(400).json({ message: 'UserId required' })

    const history = await PlayHistory.find({ user: userId })
        .populate({
            path: 'song',
            populate: {
                path: 'user',
                select: 'username icon',
                strictPopulate: false // 念のため
            }
        })
        .sort({ timestamp: -1 })
  
    // songがnullでないものだけを返す
    const songsOnly = history
        .filter(entry => entry.song && entry.song.user)
        .map(entry => entry.song)
  
    res.json(songsOnly)
  
})

module.exports = {
    recordPlayHistory,
    getPlayHistory
}