const verifySelf = (req, res, next) => {
    const { id } = req.params
    const loggedInUserId = req._id

    if (!loggedInUserId) return res.status(400).json({ message: 'Logged in user ID not found'})

    if (loggedInUserId !== id) {
        return res.status(403).json({ message: 'You can only perform this action on your own account'})
    }
    next()
}

module.exports = verifySelf