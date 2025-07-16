// register, log-in/out, refresh token, resetPwd

const User = require('../model/User')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')

//pwd, passwordの混在注意

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
    console.log(pwdMatch)
    if(!pwdMatch) return res.status(401).json({ message: 'Wrong Password'})

    // token
    const accessToken = jwt.sign(
        {
            'UserInfo': {
                'username': foundUser.username,
                '_id': foundUser._id,
                'isAdmin': foundUser.isAdmin,
                'socials': foundUser.socials,
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
    res.json({ accessToken, user: { _id: foundUser._id, username: foundUser.username, bio: foundUser.bio, icon: foundUser.icon, isAdmin: foundUser.isAdmin, socials: foundUser.socials }  })
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
                        'isAdmin': foundUser.isAdmin,
                        'socials': foundUser.socials
                    } // currentUser = useSelect(selectCurrentUser)で持ってこれるユーザー情報
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
                    isAdmin: foundUser.isAdmin,
                    socials: foundUser.socials
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


const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordTokenExpires = Date.now() + 1000 * 60 * 15; // 15分有効
  await user.save();

  const resetLink = `http://localhost:3000/reset-password/${token}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset Password',
    html: `<p>Access the link below to reset your password (15mins)</p><a href="${resetLink}">${resetLink}</a>`
  });

  res.json({ message: 'パスワードリセットリンクを送信しました' });
};

const resetPassword = asyncHandler(async (req, res) => {
    console.log('resetPassword Start')
    const { token } = req.params;
    const { password } = req.body;
    console.log('New Password:', password)
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordTokenExpires: { $gt: Date.now() } });
    console.log('user: ', user)
    if (!user) return res.status(400).json({ message: 'Token is invalid or expired' });

    user.pwd = await bcrypt.hash(password, 10);
    console.log('user.password: ', user.password)
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save()

    console.log('New Pwd: ', user)

    res.json({ message: 'Updated Password' });
})


module.exports = {
    handleRegister,
    handleLogin,
    handleLogout,
    handleRefresh,
    forgotPassword,
    resetPassword
}