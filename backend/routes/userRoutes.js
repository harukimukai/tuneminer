const express = require('express')
const router = express.Router()
const usersController = require('../controller/usersController')
const verifyJWT = require('../middleware/verifyJWT')
const verifySelf = require('../middleware/verifySelf')
const { upload } = require('../middleware/uploadFiles')

router.use(verifyJWT)

router.route('/')
    .get(usersController.getAllUsers)

router.route('/:id')
    .get(usersController.getUserProfile)
    .patch(verifySelf, 
        upload.fields([
            { name: 'icon', maxCount: 1 }
        ]), 
        usersController.updateUser
    )
    .delete(verifySelf, usersController.deleteUser)

router.route('/:id/follow')
    .post(usersController.followUser)

router.route('/:id/following')
    .get(usersController.getFollowingUsers)

router.route('/:id/followers')
    .get(usersController.getFollowers)

module.exports = router