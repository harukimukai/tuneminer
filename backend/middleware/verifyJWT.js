const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    console.log('[verifyJWT] start')
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    //console.log(authHeader); // Bearer token
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Access token expired' }) // invalid token
            req.user = decoded.UserInfo.username
            req._id = decoded.UserInfo._id
            req.isAdmin = decoded.UserInfo.isAdmin
            next()
        }
    )

    console.log('[verifyJWT] Done')
}

module.exports = verifyJWT;