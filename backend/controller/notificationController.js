const asyncHandler = require('express-async-handler')
const Notification = require('../model/Notification')

const getNotifications = asyncHandler(async(req, res) => {
    const notifications = await Notification.find({ recipient: req._id })
    .sort({ createdAt: -1 })
    .limit(50)

    res.json(notifications)
})

const markAsRead = asyncHandler(async(req, res) => {
    const notification = await Notification.findById(req.params.id)
    if (!notification) return res.status(404).json({ message: 'Not found' })
    
    notification.isRead = true
    await Notification.save()

    res.json({ message: 'Marked as read'})
})


module.exports = {
    getNotifications,
    markAsRead
}