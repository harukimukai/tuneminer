const express = require('express')
const asyncHandler = require('express-async-handler')
const MiningLike = require('../model/MiningLike')

// get(by song, by user), post, delete(remove)
const getMiningLikesBySong = asyncHandler(async(req, res) => {
    const songId = req.params.id
    if (!songId) return res.status(401).json({ message: 'No songId'})

    const miningLikesBySong = await MiningLike.find({ song: songId }).populate('user', 'username icon')

    console.log('miningLikesBySong: ', miningLikesBySong)

    res.json(miningLikesBySong)
})

const getMiningLikesByUser = asyncHandler(async(req, res) => {
    const userId = req._id
    if (!userId) return res.status(401).json({ message: 'No songId'})

    const miningLikesByUser = await MiningLike.find({ user: userId }).populate('song', 'title audioFile imageFile')

    res.json(miningLikesByUser)
})

const addMiningLike = asyncHandler(async(req, res) => {
    const userId = req._id
    const songId = req.params.id
    console.log(songId)
    if (!userId) return res.status(401).json({ message: '[addMiningLike] No userId'})
    if (!songId) return res.status(401).json({ message: '[addMiningLike] No songId'})

    const alreadyLiked = await MiningLike.findOne({ user: userId, song: songId})
    if (alreadyLiked) return res.status(400).json({ message: 'Already liked'})

    const newLike = await MiningLike.create({ user: userId, song: songId })

    res.json({ message: 'Added miningLike'})
})

const removeMiningLike = asyncHandler(async(req, res) => {
    const userId = req._id
    const songId = req.params.id
    if (!userId) return res.status(401).json({ message: 'No userId'})
    if (!songId) return res.status(401).json({ message: 'No songId'})

    const remove = await MiningLike.findOneAndDelete({ user: userId, song: songId })
    if (!remove) return res.status(404).json({ message: 'Could not remove'})

    res.json({ message: 'Removed minigLike'})
})

module.exports = {
    getMiningLikesBySong,
    getMiningLikesByUser,
    addMiningLike,
    removeMiningLike
}