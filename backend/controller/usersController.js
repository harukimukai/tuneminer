// get all users, get a specific user, update, delete

const User = require('../model/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const Song = require('../model/Song')


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) return res.status(400).json({ message: 'No users found'})

    res.json(users)
})

const getUserProfile = asyncHandler(async (req, res) => {
    const { id } = req.params
    const userId = req._id
    if (!id) return res.status(400).json({ message: 'User ID required'})

    const user = await User.findById(id).exec()
    if (!user) return res.status(400).json({ message: `User ID ${req.params.id} not found`})

    if (userId === id) {
        const songs = await Song.find({ user: id }).lean()
            .populate('user', 'username icon')

        if (!songs) return res.status(404).json({ message: 'No songs found'})
        return res.json({ user, songs })
    } else {
        const songs = await Song.find({ user: id, hidden: false }).lean()
            .populate('user', 'username icon')
    
        if (!songs) return res.status(404).json({ message: 'No songs found'})
        return res.json({ user, songs })
    }
})

const updateUser = asyncHandler(async (req, res) => {
    console.log('updateUser Start')
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'User ID required'})

    const user = await User.findById(id).exec()
    if (!user) return res.status(400).json({ message: `User ID ${id} not found`})

    if (req.body?.username) {
        const { username } = req.body
        const duplicate = await User.findOne({username}).lean().exec()
        if (duplicate && duplicate?._id.toString() !== id) {
            return res.status(409).json({ message: 'The username is alreadey used!'})
        }
        user.username = req.body.username
    }
    if (req.body?.email) {
        if (!req.body.email.includes('@')) {
            return res.status(409).json({ message: 'Email must include "@".'})
        }
        user.email = req.body.email
    }
    if (req.body?.pwd) {
        const hashedPwd = await bcrypt.hash(req.body.pwd, 10)
        user.pwd = hashedPwd
    }
    if (req.body?.bio) {
        user.bio = req.body.bio
    }
    if (req.files?.icon) {
        console.log('req.file: ', req.files.icon)
        // 古いファイルが存在すれば削除
        if (user.icon) {
            fs.unlink(user.icon, (err) => {
                if (err) console.warn('Failed to delete the old icon:', err.message)
            })
        }
        // 新しいファイルを保存
        user.icon = req.files.icon[0].path
    }
    

    const updatedUser = await user.save()

    res.json({ message: 'User updated', user: updatedUser})
})

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'User ID required'})

    const user = await User.findById(id).exec()
    if (!user) return res.status(404).json({ message: `User ID ${id} not found`})

    await user.deleteOne()
    res.json({ message: `User '${user.username}' (ID: ${id}) has been deleted.` })
})

// follow/unfollow
const followUser = asyncHandler(async (req, res) => {
    console.log('followUser process START')

    const targetUserId = req.params.id
    const currentUserId = req._id // from JWT
    if (!targetUserId) {
        return res.status(404).json({ message: 'No id from params'})
    }
    if (!currentUserId) {
        return res.status(404).json({ message: 'No id from JWT'})
    }
    if (targetUserId === currentUserId) {
        return res.status(400).json({ message: 'You can not follow yourself'})
    }

    const targetUser = await User.findById(targetUserId)
    const currentUser = await User.findById(currentUserId)
    if (!targetUser) {
        return res.status(404).json({ message: 'No targetUser'})
    }
    if (!currentUser) {
        return res.status(404).json({ message: 'No currentUser'})
    }

    // already following?
    const alreadyFollowing = currentUser.following.includes(targetUserId)
    if (alreadyFollowing) {
        currentUser.following.pull(targetUserId)
        targetUser.followers.pull(currentUserId)
        await currentUser.save()
        await targetUser.save()
        console.log(`unfollowed: ${targetUser.username}`)
        return res.json({ message: `unfollowed: ${targetUser.username}`})
    } else {
        currentUser.following.push(targetUserId)
        targetUser.followers.push(currentUserId)
        await currentUser.save()
        await targetUser.save()
        console.log(`followed: ${targetUser.username}`)
        return res.json({ message: `followed: ${targetUser.username}`})
    }
})

// following list
const getFollowingUsers = async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id).populate('following', 'username icon')
    if(!user) return res.status(404).json({ message: 'User not found'})

    res.json(user.following)
}

// followers list
const getFollowers = async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id).populate('followers', 'username icon')
    if(!user) return res.status(404).json({ message: 'User not found'})

    res.json(user.followers)
}

module.exports = {
    getAllUsers,
    getUserProfile,
    updateUser,
    deleteUser,
    followUser,
    getFollowingUsers,
    getFollowers
}