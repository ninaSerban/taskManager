const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '') //getting the header
        const decoded = jwt.verify(token, process.env.JWT_SECRET) // validate header using secret
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }) // search a user with that token from header
        
        if (!user) {
            throw new Error()
        }
        //adding user and token on req so we can use them later
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth