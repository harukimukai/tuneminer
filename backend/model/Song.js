const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    audioFile: { 
        type: String, // S3 Url, local path, etc...
        required: true 
    },
    imageFile: { 
        type: String, // S3 url, local path, etc...
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Userモデルへのリファレンスを追加
    genre: {
        type: String,
        required: true
    },
    original: {
        type: Boolean,
        defalt: false,
        required: true
    },
    lyrics: String,
    plays: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }, 
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }], // likesフィールドを配列[]にする
    hidden: {
        type: Boolean,
        default: false
    },
    highlight: {
        start: {
            type: Number,
            min: 0
        },
        end: {
            type: Number,
            validate: {
                validator: function (value) {
                    return value > this.highlight.start
                },
                message: 'end must be greater than start'
            }
        }
    },
    isRecommended: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Song', songSchema)