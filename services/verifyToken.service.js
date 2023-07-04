const { HttpStatusCode } = require('axios');
const jwt = require('jsonwebtoken');
const secret = 'samplesecret';

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return void res.status(HttpStatusCode.Unauthorized).send({ auth: false, message: 'no token provided' })

    jwt.verify(token, secret, function (err, decoded) {
        if (err) return void res.status(HttpStatusCode.InternalServerError).send({ auth: false, message: 'Failed to validate token ' + err })

        req.userId = decoded.id; //APPENDING DECODED USER ID FOR USE IN CONTROLLERS
        next();
    })
}

module.exports = verifyToken;