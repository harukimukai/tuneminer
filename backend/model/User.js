const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    pwd: {
        type: String,
        required: function() {
        return !this.googleId; // Googleログインでなければ必要
        }
    },
    googleId: { type: String },
    email: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    socials: {
        soundcloud: { type: String, default: '' },
        bandcamp: { type: String, default: '' },
        youtube: { type: String, default: '' },
        instagram: { type: String, default: '' },
        x: { type: String, default: '' }
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    icon: {
        type: String
    },
    hidden: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordTokenExpires: Date,
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);