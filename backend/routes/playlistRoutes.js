const express = require('express')
const router = express.Router()
const playlistController = require('../controller/playlistController')
const verifyJWT = require('../middleware/verifyJWT')
const { upload } = require('../middleware/uploadFiles')

// router.use((req, res, next) => {
//   console.log(`[Router] ${req.method} ${req.originalUrl}`)
//   next()
// })

// 公開プレイリスト閲覧
router.get('/', playlistController.getPlaylists)

// 認証が必要なルート
router.get('/mine', verifyJWT, playlistController.getMyPlaylists)
router.post('/', verifyJWT, upload.fields([{name: 'coverImage', maxcount: 1}]), playlistController.createPlaylist)
router.put('/:id/add', verifyJWT, playlistController.addSongPlaylist) // PUTとPATCHは別物！！
router.put('/:id/remove', verifyJWT, playlistController.removeSongPlaylist)

router.get('/:id', playlistController.getPlaylistById)
router.put('/:id', verifyJWT, playlistController.updatePlaylist)
router.delete('/:id', verifyJWT, playlistController.deletePlaylist)

module.exports = router
