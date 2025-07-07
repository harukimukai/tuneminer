const express = require('express')
const router = express.Router()
const usersController = require('../controller/usersController')
const verifyJWT = require('../middleware/verifyJWT')
const verifySelf = require('../middleware/verifySelf')
const { upload } = require('../middleware/uploadFiles')

router.route('/')
    .get(usersController.getAllUsers)

router.route('/:id')
    .get(usersController.getUserProfile)
    .patch(verifyJWT, verifySelf, 
        upload.fields([
            { name: 'icon', maxCount: 1 }
        ]), 
        usersController.updateUser
    )
    .delete(verifyJWT, verifySelf, usersController.deleteUser)

router.route('/:id/follow')
    .post(verifyJWT, usersController.followUser)

router.route('/:id/following')
    .get(usersController.getFollowingUsers)

router.route('/:id/followers')
    .get(usersController.getFollowers)

module.exports = router