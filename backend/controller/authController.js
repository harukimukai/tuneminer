// register, log-in/out, refresh token

const User = require('../model/User')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const handleRegister = asyncHandler(async (req, res) => {
    console.log('Register request')

    const {username, email, pwd} = req.body
    if (!username || !email || !pwd) return res.send('Username, Email and password are required!')

    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) return res.status(409).json({ message: 'This username is already used!'})

    const hashedPwd = await bcrypt.hash(pwd, 10)
    const newUser = await User.create({
        "username": username,
        "email": email,
        "pwd": hashedPwd
    })

    res.status(201).json({ user: newUser, message: 'Registration complete!' });
})

const handleLogin = asyncHandler(async (req, res) => {
    console.log('Login request')

    const { username, pwd } = req.body
    if (!username || !pwd) return res.status(401).json({ message: 'Username or password is missing!'})
    console.log('username: ', username)

    const foundUser = await User.findOne({ username }).exec()
    if (!foundUser) return res.status(401).json({ message: 'The username is not used'})

    const pwdMatch = await bcrypt.compare(pwd, foundUser.pwd)
    if(!pwdMatch) return res.status(401).json({ message: 'Wrong Password'})

    // token
    const accessToken = jwt.sign(
        {
            'UserInfo': {
                'username': foundUser.username,
                '_id': foundUser._id,
                'isAdmin': foundUser.isAdmin
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    console.log(`accessToken: ${accessToken}`)

    const refreshToken = jwt.sign(
        { 'username': foundUser.username},
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

    // Send accessToken containing id, username, bio, icon
    // いずれマイページを消して普通のユーザーページから自分のアカウントのみ編集ボタンを表示させるようにするから、そのときはidとusernameのみにしていい気がする。
    res.json({ accessToken, user: { _id: foundUser._id, username: foundUser.username, bio: foundUser.bio, icon: foundUser.icon, isAdmin: foundUser.isAdmin }  })
})

const handleRefresh = (req, res) => {
    console.log('refreshToken request')

    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'No cookies!'})

    console.log(`Cookies: ${cookies}`)

    const refreshToken = cookies.jwt

    console.log(`refreshToken: ${refreshToken}`)

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return console.error(err)

            const foundUser = await User.findOne({ username: decoded.username}).lean().exec()

            if(!foundUser) return res.status(401).json({ message: 'No user found!'})

            const accessToken = jwt.sign(
                {
                    'UserInfo': {
                        'username': foundUser.username,
                        '_id': foundUser._id,
                        'bio': foundUser.bio,
                        'icon': foundUser.icon,
                        'isAdmin': foundUser.isAdmin
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            console.log(`accessToken: ${accessToken}`)

            res.json({ 
                accessToken,
                user: {
                    _id: foundUser._id,
                    username: foundUser.username,
                    bio: foundUser.bio,
                    icon: foundUser.icon,
                    isAdmin: foundUser.isAdmin
                }
            })
        })
    )

    console.log('refreshToken process DONE')

}

const handleLogout = (req, res) => {
    console.log('Logout request')

    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(204).json({ message: 'No cookies'})
    console.log(`cookies: ${cookies}`)

    res.clearCookie('jwt', {
        httpOnly: true,
        secure: false, // dev
        sameSite: 'LAX'
    })

    res.json({ message: 'Cookie cleared'})
    console.log('Logout Process DONE')
}

module.exports = {
    handleRegister,
    handleLogin,
    handleLogout,
    handleRefresh
}