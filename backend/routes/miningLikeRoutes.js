const express = require('express')
const router = express.Router()
const miningLikeController = require('../controller/miningLikeController')
const verifyJWT = require('../middleware/verifyJWT')
const verifySelf = require('../middleware/verifySelf')

router.use((req, res, next) => {
  console.log(`[Router] ${req.method} ${req.originalUrl}`)
  next()
})

router.post('/:id', verifyJWT, miningLikeController.addMiningLike)
router.delete('/:id', verifyJWT, verifySelf, miningLikeController.removeMiningLike)
router.get('/:id/by-song', miningLikeController.getMiningLikesBySong)
router.get('/:id/by-user', verifyJWT, miningLikeController.getMiningLikesByUser)

module.exports = router