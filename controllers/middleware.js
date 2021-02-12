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

    if (!token) {
        return res
            .status(401)
            .send({
                success: false,
                message: 'Error: No Auth token found.'
            });
    }

    next();
}