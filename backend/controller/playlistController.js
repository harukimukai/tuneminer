const Playlist = require('../model/Playlist')
const User = require('../model/User')
const asyncHandler = require('express-async-handler')
const deleteUploadedFiles = require('../utils/deleteUploadedFiles')

const getPlaylists = asyncHandler(async(req, res) => {
    const playlists = await Playlist.find({ isPublic: true }).populate('user', 'username icon')
    res.json(playlists)
})

const getMyPlaylists = asyncHandler(async(req, res) => {
    const user = await User.findById(req._id)
    if (!user) return res.status(401).json({ message: 'No user found'})

    const myPlaylists = await Playlist.find({ user: user._id}).populate('user', 'username icon')
    if (!myPlaylists) return res.status(401).json({ message: 'No myPlaylist found'})

    res.json(myPlaylists)
})

const getPlaylistById = asyncHandler(async(req, res) => {
    const playlistId = req.params.id

    const playlist = await Playlist.findById(playlistId)
        .populate('user', 'username icon')
        .populate('songs')

    if (!playlist) return res.status(404).json({ message: 'Playlist not found' })

    if (!playlist.isPublic && playlist.user._id.toString() !== req.userId){
        return res.status(403).json({ message: 'Forbidden' })
    }

    res.json(playlist)
})

const createPlaylist = asyncHandler(async(req, res) => {
    console.log(req.body)
    const {title, description, isPublic} = req.body
    const userId = req._id

    if (!title || !isPublic) {
        deleteUploadedFiles(req.files)
        return res.status(400).json({ message: 'Title and isPublic are required'})
    }

    let coverImage = undefined
    if (req.files?.coverImage) {
        coverImage = req.files.coverImage[0].path
    }

    const playlist = await Playlist.create({
        title,
        description,
        user: userId,
        isPublic,
        coverImage
    })

    res.status(201).json(playlist)
})

const updatePlaylist = asyncHandler(async(req, res) => {
    const { title, description, songs, isPublic } = req.body
    const playlist = await Playlist.findById(req.params.id)
    if (!playlist) return res.status(404).json({ message: 'Not found' })
    if (playlist.user.toString() !== req.userId) return res.status(403).json({ message: 'Forbidden' })
    
    Object.assign(playlist, { title, description, songs, isPublic })
    await playlist.save()
    res.json(playlist)
})

const deletePlaylist = asyncHandler(async(req, res) => {
    const playlist = await Playlist.findById(req.params.id)
    if (!playlist) return res.status(401).json({ message: 'Playlist no found'})
    
    if (playlist.user.toString() !== req.userId) return res.status(403).json({ message: 'Forbidden' })

    await playlist.deleteOne()
    res.json({ message: 'Deleted successfully' })
})

module.exports = {
    getPlaylists,
    getMyPlaylists,
    getPlaylistById,
    createPlaylist,
    updatePlaylist,
    deletePlaylist
}