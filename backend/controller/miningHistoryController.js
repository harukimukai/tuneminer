const asyncHandler = require('express-async-handler')
const MiningHistory = require('../model/MiningHistory')

// record Mining
const recordMining = asyncHandler(async (req, res) => {
    console.log('recordMining Start')
    const userId = req._id
    const { songId } = req.body
    if (!songId) return res.status(404).json({ message: 'SongId is required'})

    const existingRecord = await MiningHistory.findOne({ 
        user: userId, song: songId 
    })

    if (existingRecord) {
        // 既にある場合は timestamp を更新するだけ
        existingRecord.timestamp = Date.now()
        await existingRecord.save()
        return res.status(200).json({ message: 'Mining record updated' })
    }

    const newRecord = await MiningHistory.create({
        user: userId,
        song: songId
    })
    res.status(201).json({ message: 'Mining recorded', mining: newRecord })
})

// get miningHistory
const getMyMiningHistory = asyncHandler(async (req, res) => {
    console.log('getMyMiningHistory Start')
    const userId = req._id

    const history = await MiningHistory.find({ user: userId })
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
    recordMining,
    getMyMiningHistory
}