require('dotenv').config();
const secret = process.env.JWT_TOKEN;

const jwt = require('jsonwebtoken');

const Columnists = require('../models/columnists')

const isColumnist = async (req, res, next) => {
    const token = req.headers['auth-token']

    if (!token) {
        res.status(401).send({error: 'Unauthorized: no token provided'})
    } else {
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                res.status(401).send({error: 'Unauthorized: invalid token'})
            } else {
                req.email = decoded.email
                const findColumnist = await Columnists.findOne({ email: decoded.email })
                console.log(findColumnist)
                if (findColumnist) {
                    req.columnist = findColumnist
                    next()
                } else {
                    res.status(401).send({error: `Unauthorized: You don't have this permission`})
                }
            }
        })
    }
}

module.exports = isColumnist