const verifyAdmin = (req, res, next) => {
    console.log('req.user: ', req.user)
    if (!req.isAdmin) {
        console.log('You aint admin', req.isAdmin)
        return res.status(403).json({ message: 'Access denied. Admins only.' })
    }
    next()
}
  
module.exports = verifyAdmin