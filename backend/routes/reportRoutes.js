// /report/*

const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const reportController = require('../controller/reportController')
const verifyAdmin = require('../middleware/verifyAdmin')


router.use(verifyJWT)
// /song, /user

router.post('/song', reportController.createReportSong)
router.post('/user', reportController.createReportUser)

router.use(verifyAdmin)

router.get('/song', reportController.getSongReports)
router.get('/user', reportController.getUserReports)

router.get('/song/:id', reportController.getOneSongReport)
router.get('/user/:id', reportController.getOneUserReport)

router.patch('/song/:id', reportController.dealSongReport)
router.patch('/user/:id', reportController.dealUserReport)


module.exports = router