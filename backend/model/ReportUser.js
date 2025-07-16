const mongoose = require('mongoose')

const reportUserSchema = new mongoose.Schema(
    {
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        reportedUser: {
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

module.exports = mongoose.model('ReportUser', reportUserSchema)