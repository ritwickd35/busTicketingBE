const { HttpStatusCode } = require('axios');
const jwt = require('jsonwebtoken');
const secret = 'samplesecret';

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return void res.status(403).send({ auth: false, message: 'no token provided' })

    jwt.verify(token, secret, function (err, decoded) {
        if (err) return void res.status(500).send({ auth: false, message: 'Failed to validate token' })

        req.userId = decoded.id;
        next();
    })
}

module.exports = verifyToken;