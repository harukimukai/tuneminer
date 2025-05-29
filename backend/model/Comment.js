const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    song: {
        type: Schema.Types.ObjectId,
        ref: 'Song',
        required: true
    },
    content: {
        type: String,
        reuqired: true,
        trim: true,
        maxlength: 500
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null // null is a parent comment
    }
})

module.exports = mongoose.model('Comment', commentSchema)