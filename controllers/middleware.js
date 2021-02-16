const jwt = require('jsonwebtoken');
const config = require('../configs/config');

exports.ensureAuthenticated = function (req, res, next) {
    if (!req.headers.authorization) {
        return res
            .status(403)
            .send({
                success: false,
                message: 'Error: No Auth header found.'
            });
    }

    var token = req.headers.authorization.split(" ")[1];

    if (token) {
        jwt.verify(token, config.key, (err, decoded) => {
            if (err) {
                return res.status(401)
                    .send({
                        success: false,
                        message: 'Error: Invalid Auth token.'
                    });
            } else {
                req.decoded = decoded;
                console.log(decoded);
            }
        });
    } else {
        return res
            .status(401)
            .send({
                success: false,
                message: 'Error: No Auth token found.'
            });
    }

    next();
}