const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        coverImage: {
            type: String
        },
        songs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song'
        }],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isPublic: {
            type: Boolean,
            default: true
        }
    }, {
        timestamps: true
    }
)

module.exports = mongoose.model('Playlist', playlistSchema)