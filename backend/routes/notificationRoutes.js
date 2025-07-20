const express = require('express')
const verifyJWT = require('../middleware/verifyJWT')
const notificationController = require('../controller/notificationController')
const router = express.Router()

router.get('/', verifyJWT, notificationController.getNotifications)
router.patch('/:id', verifyJWT, notificationController.markAsRead)

module.exports = router