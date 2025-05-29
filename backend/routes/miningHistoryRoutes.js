const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const miningHistoryController = require('../controller/miningHistoryController')

router.use(verifyJWT)

router.route('/')
    .post(miningHistoryController.recordMining)
    .get(miningHistoryController.getMyMiningHistory)
    
module.exports = router