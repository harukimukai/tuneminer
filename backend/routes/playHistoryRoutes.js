const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const playHistoryController = require('../controller/playHistoryController')

router.use(verifyJWT)

router.route('/:userId')
    .get(playHistoryController.getPlayHistory)

router.route('/:songId')
    .post(playHistoryController.recordPlayHistory)

module.exports = router