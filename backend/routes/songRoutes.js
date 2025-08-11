const express = require('express')
const router = express.Router()
const { upload } = require('../middleware/uploadFiles')
const songsController = require('../controller/songsController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyAdmin = require('../middleware/verifyAdmin')


// multi files upload
router.route('/')
    .post(
        upload.fields([
            { name: 'audioFile', maxCount: 1 },
            { name: 'imageFile', maxCount: 1 }
        ]),
        verifyJWT,
        songsController.uploadSong
    )
    .get(songsController.getAllSongs)


router.route('/user')
    .get(verifyJWT, songsController.getMySongs)


router.route('/liked')
    .get(verifyJWT, songsController.getLikedSongs)

router.route('/search-results')
    .get(songsController.searchSongs)


router.route('/mining')
    .get(songsController.getHighlightedSongs)

router.route('/admin-recommended')
    .get(songsController.getAdminRec)


// ':id' を含むルートはここより下

router.route('/admin-recommend/:songId')
    .patch(verifyJWT, verifyAdmin, songsController.toggleAdminRecommendation)

router.route('/:id')
    .get(songsController.getOneSong)
    .patch(
        upload.fields([
            { name: 'audioFile', maxCount: 1 },
            { name: 'imageFile', maxCount: 1 }
        ]),
        verifyJWT,
        songsController.updateSong
    )
    .delete(verifyJWT, songsController.deleteSong)
    
router.route('/:id/like')
    .patch(verifyJWT, songsController.toogleLike)

router.route('/:id/play')
    .post(verifyJWT, songsController.playSong)

router.route('/recommend/:id')
    .get(verifyJWT, songsController.getRecommendations)


module.exports = router