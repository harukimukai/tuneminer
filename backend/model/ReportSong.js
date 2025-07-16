const mongoose = require('mongoose')

const reportSongSchema = new mongoose.Schema(
    {
        song: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song',
            require: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        content: {
            type: String,
            require: true
        },
        dealed: {
            type: Boolean,
            default: false
        }
    }, {
        timestamps: true
    }
)

module.exports = mongoose.model('ReportSong', reportSongSchema)