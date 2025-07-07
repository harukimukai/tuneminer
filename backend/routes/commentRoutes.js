const express = require('express')
const router = express.Router()
const commentController = require('../controller/commentController')
const verifyJWT = require('../middleware/verifyJWT')


router.route('/')
    .post(verifyJWT, commentController.createComment)

router.route('/:songId') // :songIdはコントローラーで受け取るurl(const { songId } = req.params)と一致させる。
    .get(commentController.getCommentsBySong)

router.route('/:id')
    .delete(verifyJWT, commentController.deleteComment)


module.exports = router