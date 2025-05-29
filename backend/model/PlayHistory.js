const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        required: true
    },
    lastPlayed: {
        type: Date,
        default: Date.now
    }
})

// 同じ曲を再生した場合は重複を避けるために複合インデックス
playHistorySchema.index({ user: 1, song: 1 }, { unique: true })

module.exports = mongoose.model('PlayHistory', playHistorySchema)