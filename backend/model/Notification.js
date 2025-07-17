const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
    {
        recipient: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        }, // 通知を受け取るユーザー
        sender: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }, // 通知を送ったユーザー（任意）
        type: { 
            type: String, 
            required: true 
        }, // 例: "like", "comment", "follow", "report"
        content: { type: String }, // 任意のメッセージや詳細
        link: { type: String }, // クリック時に遷移するURL
        isRead: { 
            type: Boolean, 
            default: false 
        },
    }, {
        timestamps: true
    }
)


module.exports = mongoose.model('Notification', notificationSchema)