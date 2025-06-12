const express = require('express');
const router = express.Router();
const passport = require('passport')
const authController = require('../controller/authController');
const verifyJWT = require('../middleware/verifyJWT')
const User = require('../model/User')
const jwt = require('jsonwebtoken')

router.route('/register')
    .post(authController.handleRegister)

router.route('/login')
    .post(authController.handleLogin)

router.route('/refresh')
    .get(authController.handleRefresh)

router.route('/logout')
    .post(authController.handleLogout)

    router.get('/me', verifyJWT, async (req, res) => {
        try {
            console.log('[Server] /auth/me hit. req._id =', req._id)

            const user = await User.findById(req._id).select('-password')
            if (!user) {
                console.log('[Server] User not found')
                return res.status(404).json({ message: 'User not found' })
            }
                res.json(user)
            } catch (err) {
                console.error('[Server] Error in /auth/me:', err)
                res.status(500).json({ message: 'Internal server error' })
            }
      })



// 認証開始
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// コールバック
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  async (req, res) => {
    const user = req.user
    // token
    const accessToken = jwt.sign(
        {
            'UserInfo': {
                'username': user.username,
                '_id': user._id,
                'isAdmin': user.isAdmin
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    console.log(`accessToken: ${accessToken}`)

    const refreshToken = jwt.sign(
        { 'username': user.username},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    console.log(`refreshToken: ${refreshToken}`)

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: false, // dev version
        sameSite: 'LAX', // dev version
        maxAge: 7 * 60 * 60 * 24 * 1000
    })

    console.log('Cookie! Login process DONE')

    res.redirect(`http://localhost:3000/oauth-success?accessToken=${accessToken}`)
  }
);

router.get('/me', verifyJWT, async (req, res) => {
    try {
        const user = await User.findById(req._id).select('-password')
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json({ user })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
})

module.exports = router;