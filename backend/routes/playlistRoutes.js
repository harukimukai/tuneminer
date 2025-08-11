const express = require('express')
const router = express.Router()
const playlistController = require('../controller/playlistController')
const verifyJWT = require('../middleware/verifyJWT')
const { upload } = require('../middleware/uploadFiles')

// 公開プレイリスト閲覧
router.get('/', playlistController.getPlaylists)

// 認証が必要なルート
router.get('/mine', verifyJWT, playlistController.getMyPlaylists)
router.post('/', verifyJWT, upload.fields([{name: 'coverImage', maxcount: 1}]), playlistController.createPlaylist)
router.put('/:id/add', verifyJWT, playlistController.addSongPlaylist) // PUTとPATCHは別物！！
router.put('/:id/remove', verifyJWT, playlistController.removeSongPlaylist)

router.get('/:id', playlistController.getPlaylistById)
// formDataを使ってんのにファイルが含まれていない場合、upload.none()が必要
router.patch('/:id', verifyJWT, upload.none(), playlistController.updatePlaylist)
router.delete('/:id', verifyJWT, playlistController.deletePlaylist)

module.exports = router
