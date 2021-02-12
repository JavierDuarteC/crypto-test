const router = require('express').Router()
const User = require('../../controllers/usersController')
const UserSession = require('../../controllers/userSessionController')

router.route('/').get((req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    if (token) {
        console.log(token);
    } else {
        return res.sendStatus(403).json('Authentication error.');
    }
    UserSession.findById(token)
        .then((session) => {
            if (session) {
                console.log(session);
            } else {
                return res.send({
                    success: false,
                    message: 'Error: Invalid Token.'
                })
            }
            User.findOne({
                _id: session.userId
            })
                .then((user) => {
                    if (user) {
                        console.log(user);
                    } else {
                        return res.send({
                            success: false,
                            message: 'Error: Invalid User.'
                        })
                    }
                    return res.json({
                        username: user.username,
                        name: user.name,
                        lastname: user.lastname,
                        // todo add fav_crypto: user.favcrypto
                    });
                }).catch(err1 => {
                    return res.status(400).json('Error: ' + err1);
                });
        }).catch(err => {
            return res.status(400).json('Error: ' + err);
        });
});

module.exports = router