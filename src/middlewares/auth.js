require('dotenv').config();
const secret = process.env.JWT_TOKEN;

const jwt = require('jsonwebtoken');

const Columnists = require('../models/columnists')
const Users = require('../models/users')

const isAuth = async (req, res, next) => {
    const token = req.headers['authtoken']

    if (!token) {
        res.status(401).send({error: 'Unauthorized: no token provided'})
    } else {
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                res.status(401).send({error: 'Unauthorized: invalid token'})
            } else {
                req.email = decoded.email
                const findColumnist = await Columnists.findOne({ email: decoded.email })
                const findUser = await Users.findOne({ email: decoded.email })
                if (findColumnist || findUser) {
                    next()
                } else {
                    res.status(401).send({error: `Unauthorized: You don't have permission`})
                }
            }
        })
    }
}

module.exports = isAuth