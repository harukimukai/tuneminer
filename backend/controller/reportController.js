const express = require('express')
const asyncHandler = require('express-async-handler')
const User = require('../model/User')
const Song = require('../model/Song')
const ReportSong = require('../model/ReportSong')
const ReportUser = require('../model/ReportUser')

const createReportSong = asyncHandler(async(req, res) => {
    const userId = req._id
    const { songId, data } = req.body
    const content = data.content
    if (!userId) return res.status(401).json({ message: 'No userId'})
    if (!songId) return res.status(401).json({ message: 'No songId'})
    if (!content) return res.status(401).json({ message: 'No content'})
    
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found'})
    const song = await Song.findById(songId).populate('user', 'username icon')
    if (!song) return res.status(404).json({ message: 'Song not found'})
    
    const reportSong = await ReportSong.create({
        song: song,
        user: user,
        content: content
    })

    res.json(reportSong)
})

const createReportUser = asyncHandler(async(req, res) => {
    const reporterId = req._id
    const { reportedId, content } = req.body
    if (!reporterId) return res.status(401).json({ message: 'No reporterId'})
    if (!reportedId) return res.status(401).json({ message: 'No reportedId'})
    if (!content) return res.status(401).json({ message: 'No content'})
    
    const reporter = await User.findById(reporterId)
    if (!reporter) return res.status(404).json({ message: 'Reporter not found'})
    const reportedUser = await User.findById(reportedUserId)
    if (!reportedUser) return res.status(404).json({ message: 'ReportedUser not found'})
    
    const reportUser = await ReportUser.create({
        reporter,
        reportedUser,
        content
    })

    res.json(reportUser)
})

const getSongReports = asyncHandler(async(req,res) => {
    const reportedSongs = await ReportSong.find()
        .populate('song', 'title')
        .populate('user', 'username icon')

    res.json(reportedSongs)
})

const getUserReports = asyncHandler(async(req,res) => {
    const reportUsers = await ReportUser.find()

    res.json(reportUsers)
})

const getOneSongReport = asyncHandler(async(req,res) => {
    const songReportId = req.params.id
    const reportedSong = await ReportSong.find(songReportId)

    res.json(reportedSong)
})

const getOneUserReport = asyncHandler(async(req,res) => {
    const userReportId = req.params.id
    const reportedUser = await ReportUser.find(userReportId)

    res.json(reportedUser)
})

const dealSongReport = asyncHandler(async(req, res) => {
    const songReportId = req.params.id
    if (!songReportId) return res.status(401).json({ message: 'No songReportId' })
    
    const songReport = await ReportSong.findById(songReportId)
    if (!songReport) return res.status(404).json({ message: 'songReport not found' })

    songReport.dealed = true
    await ReportSong.save()
    res.json({ message: 'Dealed the report'})
})

const dealUserReport = asyncHandler(async(req, res) => {
    const userReportId = req.params.id
    if (!userReportId) return res.status(401).json({ message: 'No userReportId' })
    
    const userReport = await ReportUser.findById(userReportId)
    if (!userReport) return res.status(404).json({ message: 'userReport not found' })

    userReport.dealed = true
    await ReportUser.save()
    res.json({ message: 'Dealed the report'})
})

module.exports = {
    createReportSong,
    createReportUser,
    getSongReports,
    getUserReports,
    getOneSongReport,
    getOneUserReport,
    dealSongReport,
    dealUserReport
}